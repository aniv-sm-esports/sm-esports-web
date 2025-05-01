import {Column, DataType, Model, Table} from 'sequelize-typescript';
import {Entity} from './Entity';

@Table({
  modelName: 'ChatCategoryGroupMap',
  tableName: 'ChatCategoryGroupMap',
  freezeTableName: true,
  timestamps: false
})
export class ChatCategoryGroupMap extends Entity<ChatCategoryGroupMap> {

  constructor(){
    super();
  }

  public ctor() {
    return new ChatCategoryGroupMap();
  }

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    allowNull: false,
  })
  get Id():number { return this.getDataValue('Id'); }
  set Id(value: number) { this.setDataValue('Id', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  get ChatCategoryId():number { return this.getDataValue('ChatCategoryId'); }
  set ChatCategoryId(value: number) { this.setDataValue('ChatCategoryId', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  get ChatGroupId():number { return this.getDataValue('ChatGroupId'); }
  set ChatGroupId(value:number) { this.setDataValue('ChatGroupId', value); }
}
