import { Body, Controller, Get, Param, Post, Session, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInterface } from 'src/session/session.interface';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}
  @Post()
  async create(@Body('title') title: string, @Session() session: SessionInterface) {
    await this.notesService.create({ title, session });
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const note = await this.notesService.findOne({ id });
    return note;
  }
}
