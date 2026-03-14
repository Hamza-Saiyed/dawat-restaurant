// Contact/Messages service — business logic layer

import { ContactRepository } from '@/backend/repositories/contact.repository';
import { ActivityLogService } from './activityLog.service';
import { AppError } from '@/backend/utils/asyncHandler';
import { CreateContactDto, UpdateContactDto } from '@/backend/validators/contact.validator';
import { IContact } from '@/models/Contact';

export class ContactService {
  async createContact(data: CreateContactDto): Promise<IContact> {
    return ContactRepository.create(data as Partial<IContact>);
  }

  async getMessages(filter?: string, search?: string): Promise<IContact[]> {
    const query: Record<string, unknown> = {};

    if (filter === 'unread') {
      query.isRead = false;
    } else if (filter === 'archived') {
      query.isArchived = true;
    } else {
      query.isArchived = { $ne: true }; // Default: show non-archived
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    return ContactRepository.findAll(query);
  }

  async getById(id: string): Promise<IContact> {
    const message = await ContactRepository.findByIdLean(id);
    if (!message) throw new AppError('Message not found', 404, 'NOT_FOUND');
    return message;
  }

  async updateMessage(
    id: string,
    data: UpdateContactDto,
    adminEmail: string
  ): Promise<IContact> {
    const updateData: Record<string, unknown> = { ...data };

    // Auto-set readAt when marking as read for first time
    if (data.isRead === true) {
      const current = await ContactRepository.findById(id);
      if (current && !current.isRead) {
        updateData.readAt = new Date();
      }
    }

    const updated = await ContactRepository.update(id, updateData as Partial<IContact>);
    if (!updated) throw new AppError('Message not found', 404, 'NOT_FOUND');

    // Log activity
    if (data.isRead !== undefined) {
      ActivityLogService.log({
        adminEmail,
        action: 'MESSAGE_READ',
        resourceType: 'message',
        resourceId: id,
      }).catch(() => {});
    }
    if (data.isArchived !== undefined) {
      ActivityLogService.log({
        adminEmail,
        action: 'MESSAGE_ARCHIVED',
        resourceType: 'message',
        resourceId: id,
      }).catch(() => {});
    }

    return updated;
  }

  async deleteMessage(id: string, adminEmail: string): Promise<void> {
    const result = await ContactRepository.delete(id);
    if (!result) throw new AppError('Message not found', 404, 'NOT_FOUND');

    ActivityLogService.log({
      adminEmail,
      action: 'MESSAGE_DELETED',
      resourceType: 'message',
      resourceId: id,
    }).catch(() => {});
  }
}
