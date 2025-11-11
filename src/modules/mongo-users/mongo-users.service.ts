// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// // import { MongoUser, MongoUserDocument } from './schemas/mongo-user.schema';

// @Injectable()
// export class MongoUsersService {
//   constructor(
//     @InjectModel(MongoUser.name) private userModel: Model<MongoUserDocument>,
//   ) {}

//   async create(createUserDto: any): Promise<MongoUser> {
//     const createdUser = new this.userModel(createUserDto);
//     return createdUser.save();
//   }

//   async findAll(): Promise<MongoUser[]> {
//     return this.userModel.find().exec();
//   }

//   async findOne(id: string): Promise<MongoUser> {
//     return this.userModel.findById(id).exec();
//   }

//   async findByEmail(email: string): Promise<MongoUser> {
//     return this.userModel.findOne({ email }).exec();
//   }

//   async update(id: string, updateUserDto: any): Promise<MongoUser> {
//     return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
//   }

//   async remove(id: string): Promise<MongoUser> {
//     return this.userModel.findByIdAndDelete(id).exec();
//   }
// }
