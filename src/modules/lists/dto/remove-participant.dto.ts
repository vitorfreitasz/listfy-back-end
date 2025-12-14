import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class RemoveParticipantDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId: number;
}
