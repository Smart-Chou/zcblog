export interface PostData {
    date: string;
    title: string;
    wordCount: number;
}

function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

function getClassForValue(count: number): string {
    if (count === 0) return "color-empty";
    if (count < 300) return "color-github-1";
    if (count < 800) return "color-github-2";
    if (count < 1500) return "color-github-3";
    return "color-github-4";
}

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export function initHeatmap(postsData: PostData[]): void {
    const container = document.getElementById("heatmap-container");
    if (!container) return;
    container.innerHTML = "";

    const today = new Date();
    const isMobile = window.innerWidth < 768;
    const startDate = new Date(today);
    if (isMobile) {
        startDate.setMonth(today.getMonth() - 6);
    } else {
        startDate.setFullYear(today.getFullYear() - 1);
    }
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const dataMap: Record<string, PostData> = {};
    postsData.forEach((p) => {
        dataMap[p.date] = p;
    });

    const months: { month: string; col: number }[] = [];
    const currentDate = new Date(startDate);
    let lastMonth = -1;
    let weekIndex = 0;

    while (currentDate <= today) {
        const month = currentDate.getMonth();
        if (month !== lastMonth) {
            months.push({ month: monthNames[month], col: weekIndex });
            lastMonth = month;
        }
        currentDate.setDate(currentDate.getDate() + 7);
        weekIndex++;
    }

    const monthRow = document.createElement("div");
    monthRow.className = "heatmap-months";
    months.forEach((m) => {
        const span = document.createElement("span");
        span.textContent = m.month;
        span.style.gridColumn = (m.col + 1).toString();
        monthRow.appendChild(span);
    });
    container.appendChild(monthRow);

    const wrapper = document.createElement("div");
    wrapper.className = "heatmap-wrapper";

    const yLabels = document.createElement("div");
    yLabels.className = "heatmap-y-labels";
    yLabels.innerHTML =
        "<span>Sun</span><span></span><span>Tue</span><span></span><span>Thu</span><span></span><span>Sat</span>";
    wrapper.appendChild(yLabels);

    const grid = document.createElement("div");
    grid.className = "heatmap-grid";

    let cellDate = new Date(startDate);
    while (cellDate <= today) {
        const cell = document.createElement("div");
        const dateStr = formatDate(cellDate);
        const dayData = dataMap[dateStr];

        if (dayData) {
            cell.className = "heatmap-day " + getClassForValue(dayData.wordCount);
            cell.dataset.date = dayData.date;
            cell.dataset.title = dayData.title;
            cell.dataset.count = dayData.wordCount.toString();

            cell.addEventListener("mouseenter", () => {
                const tooltip = document.createElement("div");
                tooltip.className = "heatmap-tooltip";
                tooltip.innerHTML =
                    '<div class="heatmap-tooltip-date">' +
                    dayData.date +
                    "</div>" +
                    '<div class="heatmap-tooltip-content">' +
                    "<div>" +
                    dayData.wordCount +
                    " 字</div>" +
                    "<div>《" +
                    dayData.title +
                    "》</div>" +
                    "</div>";
                document.body.appendChild(tooltip);
                const rect = cell.getBoundingClientRect();
                tooltip.style.left = rect.left + "px";
                tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + "px";
            });

            cell.addEventListener("mouseleave", () => {
                document.querySelectorAll(".heatmap-tooltip").forEach((t) => t.remove());
            });
        } else {
            cell.className = "heatmap-day color-empty";
        }

        grid.appendChild(cell);
        cellDate.setDate(cellDate.getDate() + 1);
    }

    wrapper.appendChild(grid);
    container.appendChild(wrapper);

    const legendDiv = document.createElement("div");
    legendDiv.className = "heatmap-legend";
    const levelClasses = [
        "color-empty",
        "color-github-1",
        "color-github-2",
        "color-github-3",
        "color-github-4",
    ];
    legendDiv.innerHTML =
        "<span>Less</span>" +
        levelClasses
            .map((cls) => '<span class="heatmap-legend-item ' + cls + '"></span>')
            .join("") +
        "<span>More</span>";
    container.appendChild(legendDiv);
}

let registered = false;

export function registerHeatmap(): void {
    if (registered) return;
    registered = true;

    const run = () => {
        const container = document.getElementById("heatmap-container");
        if (!container) return;
        const raw = container.dataset.posts;
        if (!raw) return;
        const postsData: PostData[] = JSON.parse(raw);
        initHeatmap(postsData);
    };

    document.addEventListener("astro:page-load", run);
    if (document.readyState !== "loading") {
        run();
    } else {
        document.addEventListener("DOMContentLoaded", run);
    }
}
