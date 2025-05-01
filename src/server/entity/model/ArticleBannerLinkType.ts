import {Column, DataType, Model, Table} from 'sequelize-typescript';
import { Entity } from './Entity';

export enum ArticleBannerLinkTypeEnum {
  None = 0,
  Image = 1,
  YoutubeVideo
}

@Table({
  modelName: 'ArticleBannerLinkType',
  tableName: 'ArticleBannerLinkType',
  freezeTableName: true,
  timestamps: false
})
export class ArticleBannerLinkType extends Entity<ArticleBannerLinkType> {

  public constructor() {
    super();

    this.Id = 0;
    this.Name = '';
  }

  public ctor() {
    return new ArticleBannerLinkType();
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
