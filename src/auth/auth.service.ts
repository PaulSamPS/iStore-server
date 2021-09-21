import { Injectable } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UserModel } from './user.model'
import { InjectModel } from 'nestjs-typegoose'
import { genSalt, hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
	) { }
	async createUser(dto: AuthDto) {
		const salt = genSalt(10)
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: hashSync(dto.password, await salt)
		})
		return newUser.save()
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec()
	}
}