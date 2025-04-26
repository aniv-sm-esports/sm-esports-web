import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
  modelName: 'ChatGroup',
  tableName: 'ChatGroup',
  freezeTableName: true,
  timestamps: false
})
export class ChatGroup extends Model {

  public constructor() {
    super();

    this.Id = 0;
    this.Name = '';
    this.Description = '';
  }

  public ctor() {
    return new ChatGroup();
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
    type: DataType.STRING,
    allowNull: false,
  })
  get Name():string { return this.getDataValue('Name'); }
  set Name(value: string) { this.setDataValue('Name', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get Description():string { return this.getDataValue('Description'); }
  set Description(value: string) { this.setDataValue('Description', value); }
};
