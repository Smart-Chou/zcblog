import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { t } from "../i18n/utils";
import { config } from "../self.config";

dayjs.locale(config.lang);
dayjs.extend(advancedFormat);
dayjs.extend(utc);

export function formatDate(date: Date, dateType = "post.dateFormat"): string {
    if (date) {
        const dateFormat = t(dateType) || "YYYY-MM-DD";
        return dayjs(date).utc().format(dateFormat);
    } else {
        return "";
    }
}
