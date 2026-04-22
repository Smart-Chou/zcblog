import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { config } from "~/self.config";

dayjs.locale(config.lang);
dayjs.extend(advancedFormat);
dayjs.extend(utc);

export function formatDate(date: Date): string {
    if (date) {
        const dateFormat = "YYYY-MM-DD";
        return dayjs(date).utc().format(dateFormat);
    } else {
        return "";
    }
}
