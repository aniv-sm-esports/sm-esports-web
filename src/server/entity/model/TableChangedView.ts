import {Column, DataType, Model, Table} from "sequelize-typescript";
import {Entity} from './Entity';

@Table({
  modelName: 'TableChangedView',
  tableName: 'TableChangedView',
  freezeTableName: true,
  timestamps: false
})
export class TableChangedView extends Entity<TableChangedView> {

  public constructor() {
    super();
  }

  public ctor() {
    return new TableChangedView();
  }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  get Id():number { return this.getDataValue('Id'); }
  set Id(value: number) { this.setDataValue('Id', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get TableName():number { return this.getDataValue('TableName'); }
  set TableName(value: number) { this.setDataValue('TableName', value); }

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  get Timestamp():Date { return this.getDataValue('Timestamp'); }
  set Timestamp(value: Date) { this.setDataValue('Timestamp', value); }
}
