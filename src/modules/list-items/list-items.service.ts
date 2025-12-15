import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { EditListItemDto } from './dto/edit-list-item.dto';

@Injectable()
export class ListItemsService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(listId: number, dto: CreateListItemDto, user: User) {
    const list = await this.getListOrFail(listId, user);

    const existingItem = await this.listItemRepository.findOne({
      where: { list: { id: list.id }, name: dto.name },
    });

    if (existingItem) {
      throw new ConflictException('Item já cadastrado nessa lista');
    }

    const item = this.listItemRepository.create({
      ...dto,
      quantity: dto.quantity ?? 1,
      list,
    });

    return this.listItemRepository.save(item);
  }

  async assign(listId: number, itemId: number, user: User) {
    const list = await this.getListOrFail(listId, user);

    const item = await this.listItemRepository.findOne({
      where: { id: itemId, list: { id: listId } },
      relations: ['assignedTo'],
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    if (item.assignedTo) {
      throw new ConflictException('Item já atribuído a outro usuário');
    }

    // Buscar o usuário completo do banco, pois o user do decorator é apenas parcial
    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!fullUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    item.assignedTo = fullUser;
    return this.listItemRepository.save(item);
  }

  async unassign(listId: number, itemId: number, user: User) {
    const list = await this.getListOrFail(listId, user);

    const item = await this.listItemRepository.findOne({
      where: { id: itemId, list: { id: listId } },
      relations: ['assignedTo'],
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    if (!item.assignedTo) {
      throw new ConflictException('Item não está atribuído a nenhum usuário');
    }

    item.assignedTo = null;
    return this.listItemRepository.save(item);
  }

  async edit(listId: number, itemId: number, dto: EditListItemDto, user: User) {
    const list = await this.getListOrFail(listId, user);

    const item = await this.listItemRepository.findOne({
      where: { id: itemId, list: { id: listId } },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }
    if (dto.name !== undefined) {
      item.name = dto.name;
    }

    if (dto.quantity !== undefined) {
      item.quantity = dto.quantity;
    }
    return this.listItemRepository.save(item);
  }

  async delete(listId: number, itemId: number, user: User) {
    const list = await this.getListOrFail(listId, user);

    const item = await this.listItemRepository.findOne({
      where: { id: itemId, list: { id: listId } },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    return this.listItemRepository.softRemove(item);
  }

  private async getListOrFail(listId: number, user: User) {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['owner', 'participants'],
    });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    const ownerId = Number(list.owner?.id);
    const requesterId = Number(user?.id);
    const isOwner = ownerId === requesterId;
    const isParticipant = list.participants?.some((p) => p.id === requesterId);

    if (!isOwner && !isParticipant) {
      throw new ForbiddenException('Acesso negado');
    }

    return list;
  }
}
