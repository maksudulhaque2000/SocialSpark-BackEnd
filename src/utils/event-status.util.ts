import Event from '../modules/events/event.model';

/**
 * Update event statuses based on current date
 * This should be called periodically (e.g., daily via cron job)
 */
export const updateEventStatuses = async (): Promise<void> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Mark events as completed if date has passed
    await Event.updateMany(
      {
        date: { $lt: today },
        status: { $in: ['upcoming', 'ongoing'] },
      },
      {
        $set: { status: 'completed' },
      }
    );

    console.log('Event statuses updated successfully');
  } catch (error) {
    console.error('Error updating event statuses:', error);
  }
};

/**
 * Update a single event's status based on its date
 */
export const updateSingleEventStatus = async (eventId: string): Promise<void> => {
  try {
    const event = await Event.findById(eventId);
    if (!event) return;

    const now = new Date();
    const eventDate = new Date(event.date);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    // If event date has passed and not cancelled, mark as completed
    if (eventDay < today && event.status !== 'cancelled') {
      event.status = 'completed';
      await event.save();
    }
  } catch (error) {
    console.error('Error updating single event status:', error);
  }
};
