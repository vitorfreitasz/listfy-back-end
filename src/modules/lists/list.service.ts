import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateListDto } from './dto/update-list.dto';
import { CreateListDto } from './dto/create-list.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateListDto, user: User) {
    const list = this.listRepository.create({
      ...dto,
      owner: user,
    });
    return this.listRepository.save(list);
  }

  async findAll(user: User) {
    // Buscar listas onde o usuário é owner ou participante
    const ownedLists = await this.listRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner', 'items', 'participants'],
    });

    const participatingLists = await this.listRepository.find({
      where: { participants: { id: user.id } },
      relations: ['owner', 'items', 'participants'],
    });

    // Combinar e remover duplicatas
    const allLists = [...ownedLists, ...participatingLists];
    const uniqueLists = allLists.filter(
      (list, index, self) => index === self.findIndex((l) => l.id === list.id),
    );

    return uniqueLists;
  }

  async findOne(id: number, user: User) {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['owner', 'participants', 'items', 'items.assignedTo'],
    });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    const isOwner = list.owner.id === user.id;
    const isParticipant = list.participants?.some((p) => p.id === user.id);

    if (!isOwner && !isParticipant) {
      throw new ForbiddenException('Acesso negado');
    }

    return this.formatListResponse(list);
  }

  private formatListResponse(list: List) {
    // Formatar owner (sem senha e sem datas)
    const { password, createdAt, updatedAt, deletedAt, ...owner } = list.owner;

    // Formatar participants (sem senha e sem datas)
    const participants = (list.participants || []).map((participant) => {
      const { password, createdAt, updatedAt, deletedAt, ...safeParticipant } =
        participant;
      return safeParticipant;
    });

    // Formatar items (mantém datas dos itens, mas remove senha e datas dos usuários assignedTo)
    const items = (list.items || []).map((item) => {
      const itemData: any = {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      };

      if (item.assignedTo) {
        const { password, createdAt, updatedAt, deletedAt, ...safeAssignedTo } =
          item.assignedTo;
        itemData.assignedTo = safeAssignedTo;
      }

      return itemData;
    });

    return {
      id: list.id,
      name: list.name,
      description: list.description,
      owner,
      participants,
      items,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      deletedAt: list.deletedAt,
    };
  }

  async update(id: number, dto: UpdateListDto, user: User) {
    const list = await this.getListOrFail(id, user, true);

    Object.assign(list, dto);
    return this.listRepository.save(list);
  }

  async remove(id: number, user: User) {
    const list = await this.getListOrFail(id, user, true);

    await this.listRepository.remove(list);
  }

  async addParticipant(id: number, dto: AddParticipantDto, user: User) {
    const list = await this.getListOrFail(id, user, true);

    const participant = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!participant) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (participant.id === list.owner.id) {
      throw new ConflictException('O dono da lista já tem acesso total');
    }

    // Verificar se já é participante
    const isAlreadyParticipant = list.participants?.some(
      (p) => p.id === participant.id,
    );

    if (isAlreadyParticipant) {
      throw new ConflictException('Usuário já é participante desta lista');
    }

    if (!list.participants) {
      list.participants = [];
    }

    list.participants.push(participant);
    return this.listRepository.save(list);
  }

  async removeParticipant(id: number, dto: RemoveParticipantDto, user: User) {
    const list = await this.getListOrFail(id, user, true);

    if (!list.participants) {
      list.participants = [];
    }

    list.participants = list.participants.filter((p) => p.id !== dto.userId);

    return this.listRepository.save(list);
  }

  async getParticipants(id: number, user: User) {
    const list = await this.getListOrFail(id, user, false);
    return list.participants || [];
  }

  private async getListOrFail(
    id: number,
    user: User,
    ownerOnly: boolean = false,
  ): Promise<List> {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['owner', 'participants'],
    });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    const isOwner = list.owner.id === user.id;
    const isParticipant = list.participants?.some((p) => p.id === user.id);

    if (ownerOnly && !isOwner) {
      throw new ForbiddenException('Apenas o dono pode realizar esta ação');
    }

    if (!ownerOnly && !isOwner && !isParticipant) {
      throw new ForbiddenException('Acesso negado');
    }

    return list;
  }
}
