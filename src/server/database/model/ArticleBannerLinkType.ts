import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
  modelName: 'ArticleBannerLinkType',
  tableName: 'ArticleBannerLinkType',
  freezeTableName: true,
  timestamps: false
})
export class ArticleBannerLinkType extends Model {
  public constructor() {
    super();

    this.Id = 0;
    this.Name = '';
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
}
