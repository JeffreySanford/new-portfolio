import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecordsService } from './records.service';
import { Record } from './entities/record.entity';

@Controller('records')
export class RecordsController {
  recordGenerationTime: number;
  constructor(private readonly recordService: RecordsService) { }

  @Get()
  getAllRecords(): Record[] {
    return this.recordService.getAllRecords();
  }

  @Get('total-income/:UID')
  getTotalIncome(@Param('UID') UID: string): number {
    return this.recordService.calculateTotalIncome(UID);
  }

  @Get('generate')
  generateMultipleRecords(@Query('count') count: number): Record[] {
    // Convert count to a number and provide a default if necessary
    const recordCount = Number(count) || 10; // Default to 10 if count is not provided
    this.recordGenerationTime = undefined;
  
    const startTime = performance.now();

    // Generate the records
    const records: Record[] = this.recordService.generateMultipleRecords(recordCount);
    
    // End the timer
    const endTime = performance.now();
    
    // Calculate the elapsed time
    this.recordGenerationTime = endTime - startTime;
    
    // Log the number of records generated and the elapsed time
    console.log(recordCount + ' records generated in: ' + this.recordGenerationTime + ' ms');

    return records;
  }

  @Get('time')
  getCreationTime(): number {
    console.log('record generation time ' + this.recordGenerationTime);
    return this.recordGenerationTime;
  }

  @Get(':UID')
  getRecord(@Param('UID') UID: string): Record {
    return this.recordService.getRecordByUID(UID);
  }
}