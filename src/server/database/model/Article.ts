import {Table, Column, Model, HasMany, DataType, AllowNull, PrimaryKey, AutoIncrement} from 'sequelize-typescript';
import { IRepositoryEntity } from './IRepositoryEntity';

@Table({
  modelName: 'Article',
  tableName: 'Article',
  freezeTableName: true,
  timestamps: false
})
export class Article extends Model implements IRepositoryEntity {

  public constructor() {
    super();

    this.Id = 0;
    this.UserId = 0;
    this.Date = new Date();
    this.Title = '';
    this.Description = '';
    this.Body = undefined;
    this.BannerImageUrl = undefined;
    this.BannerYoutubeSourceId = undefined;
    this.BannerLinkTypeId = 0;
  }

  /*
      type: DataType
      unique?: boolean | string | {
          name: string
          msg: string
      }
      primaryKey?: boolean
      autoIncrement?: boolean
      autoIncrementIdentity?: boolean
      comment?: string
      references?: string | ModelAttributeColumnReferencesOptions
      onUpdate?: string
      onDelete?: string
      validate?: ModelValidateOptions
      values?: readonly string[]
      get?(this: M): unknown
      set?(this: M, val: unknown): void
   */

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
    allowNull: false,
  })
  get UserId():number { return this.getDataValue('UserId'); }
  set UserId(value: number) { this.setDataValue('UserId', value); }

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  get Date():Date { return this.getDataValue('Date'); }
  set Date(value:Date) { this.setDataValue('Date', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get Title():string { return this.getDataValue('Title'); }
  set Title(value: string) { this.setDataValue('Title', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get Description():string { return this.getDataValue('Description'); }
  set Description(value: string) { this.setDataValue('Description', value); }

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  get Body():string | undefined { return this.getDataValue('Body'); }
  set Body(value: string | undefined) { this.setDataValue('Body', value); }

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  get BannerImageUrl():string | undefined{ return this.getDataValue('BannerImageUrl'); }
  set BannerImageUrl(value: string | undefined) { this.setDataValue('BannerImageUrl', value); }

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  get BannerYoutubeSourceId():string | undefined { return this.getDataValue('BannerYoutubeSourceId'); }
  set BannerYoutubeSourceId(value: string | undefined) { this.setDataValue('BannerYoutubeSourceId', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  get BannerLinkTypeId():number { return this.getDataValue('BannerLinkTypeId'); }
  set BannerLinkTypeId(value: number) { this.setDataValue('BannerLinkTypeId', value); }
}
