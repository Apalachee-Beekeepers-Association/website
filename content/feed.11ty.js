import { ICalCalendar, ICalAlarmType, ICalCalendarMethod } from "ical-generator"

class FeedTemplate {
    // Setup Eleventy data for this template,
    // namely set the name of the file to be generated
    data() {
        return {
            layout: '',
            permalink: 'feed.ics',
        }
    }

    // The render method is called
    async render({ calendar, collections }) {
        // Generate a calendar object based on the calendar configuration
        // plus information provided by eleventy
        const cal = new ICalCalendar({
            name: calendar.title,
            description: calendar.description,
            prodId: {
                company: calendar.organisation,
                product: 'Eleventy',
            },
            url: calendar.url + this.page.url,
            method: ICalCalendarMethod.PUBLISH,
        })

        // Loop through of each of our events using the collection
        for (const page of collections.events) {
            // Create a calendar event from each page
            const eventParams = {
                id: `${calendar.url}/${page.url}`,
                start: page.data.date,
                summary: page.data.title,
                description: (await page.template.read()).content
            };
            if (page.data.end) {
                eventParams.end = page.data.end;
            }
            const event = cal.createEvent(eventParams)

            // Add an alert to the event
            const alarm = new Date(page.data.date)
            alarm.setMinutes(alarm.getMinutes() - 15)
            event.createAlarm({
                type: ICalAlarmType.display,
                trigger: alarm,
            })
        }

        // Generate the ical file and return it for Eleventy
        return cal.toString()
    }
}

export default FeedTemplate