import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import { t } from '../i18n/utils'
import { config } from '../self.config'

dayjs.locale(config.lang)
dayjs.extend(advancedFormat)
dayjs.extend(utc)

export function formatDate(
  pubDate: Date,
  dateType = 'post.pubDateFormat'
): string {
  if (pubDate) {
    const pubDateFormat = t(dateType) || 'YYYY-MM-DD'
    return dayjs(pubDate).utc().format(pubDateFormat)
  } else {
    return ''
  }
}
