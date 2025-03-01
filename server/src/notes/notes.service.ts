import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { SessionInterface } from 'src/session/session.interface';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(
    private dataSource: DataSource,
    private i18n: I18nService
  ) {}
  private manager = this.dataSource.manager;

  async create({ title, session }: { title: string; session: SessionInterface }) {
    const author = await this.manager.findOne(User, { where: { id: session.userId } });
    if (!author) throw new NotFoundException(this.i18n.t('validation.ACCOUNT_NOT_FOUND'));
    const newNote = this.manager.create(Note, { title, author });
    await this.manager.save(Note, newNote);
  }

  async findOne({ id }: { id: string }) {
    const note = await this.manager.findOne(Note, { where: { id } });
    return note;
  }
}
