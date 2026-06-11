import { IsUUID, IsEnum, IsNotEmpty } from 'class-validator';
import { INTERACTION_TYPE } from '@prisma/client';

export class CreateInteractionBodyDto {
    @IsNotEmpty()
    @IsEnum(INTERACTION_TYPE)
    actionType!: INTERACTION_TYPE;
}

export class CreateInteractionParamsDto {
    @IsNotEmpty()
    @IsUUID()
    id!: string;
}