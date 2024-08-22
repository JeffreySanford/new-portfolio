import { Controller, Get, Query, Param } from '@nestjs/common';
import { RecordsService } from './records.service';
import { Record } from './entities/record.interface';

@Controller('records')
export class RecordsController {
  private recordGenerationTime: number = 0;

  constructor(private readonly recordService: RecordsService) {}

  @Get()
  getAllRecords(): Record[] {
    return this.recordService.getAllRecords();
  }

  @Get('total-income/:UID')
  getTotalIncome(@Param('UID') UID: string): number {
    return this.recordService.calculateTotalIncome(UID);
  }

  // Generate multiple records api/records/generate?count=100
  @Get('generate')
  generateMultipleRecords(@Query('count') count: number): Record[] {
    console.log('Received request to generate records with count:', count);

    // Convert count to a number and provide a default if necessary
    const recordCount = Number(count) || 10; // Default to 10 if count is not provided
    console.log('Parsed record count:', recordCount);

    this.recordGenerationTime = 0;
  
    const startTime = performance.now();
    console.log('Start time:', startTime);

    // Generate the records
    const records: Record[] = this.recordService.generateMultipleRecords(recordCount);
    console.log('Generated records:', records);
    
    // End the timer
    const endTime = performance.now();
    console.log('End time:', endTime);
    
    // Calculate the elapsed time
    this.recordGenerationTime = endTime - startTime;
    console.log('Elapsed time:', this.recordGenerationTime);
    
    // Log the number of records generated and the elapsed time
    console.log(recordCount + ' records generated in: ' + this.recordGenerationTime + ' ms');

    return records;
  }

  @Get('time')
  getCreationTime(): number {
    console.log('Record generation time:', this.recordGenerationTime);
    return this.recordGenerationTime;
  }
}