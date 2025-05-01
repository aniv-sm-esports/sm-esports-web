import {Column, DataType, Model, Table} from 'sequelize-typescript';
import {Entity} from './Entity';

@Table({
  modelName: 'File',
  tableName: 'File',
  freezeTableName: true,
  timestamps: false
})
export class File extends Entity<File> {

  constructor(){
    super();
  }

  public ctor() {
    return new File();
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
    allowNull: false
  })
  get Name():string { return this.getDataValue('Name'); }
  set Name(value: string) { this.setDataValue('Name', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get Path():string { return this.getDataValue('Path'); }
  set Path(value:string) { this.setDataValue('Path', value); }
}
