import React from 'react';

import { DataGripMonth } from 'ts/helpers/DataGrip/components/month';

import { Filters } from '../interfaces/Filters';
import Day from './Day';
import { DayEvents } from '../helpers/events';

import style from '../styles/index.module.scss';

interface IBodyProps {
  max: number;
  month: DataGripMonth;
  events: DayEvents;
  filters: Filters;
}

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function Body({
  max,
  month,
  events,
  filters,
}: IBodyProps): React.ReactElement | null {
  const firstDay = month.date.getDay() - 1;
  const lastDay = firstDay + DAYS_IN_MONTH[month.month];
  const allDays = (new Array(6 * 7)).fill(0);
  let currentDay = 0;

  const days = allDays.map((v: any, index: number) => {
    const dayInMonth = index - firstDay + 1;
    const dayInfo = month.days[currentDay];
    const eventsByDay = events.get(dayInfo?.timestamp);

    if (dayInfo?.dayInMonth === dayInMonth) {
      currentDay += 1;
      return (
        <Day
          key={index}
          max={max}
          dayNumber={index}
          dayInfo={dayInfo}
          events={eventsByDay}
          filters={filters}
       />
      );
    }

    return (
      <div
        key={index}
        className={style.year_chart_month_body_day}
        style={{
          opacity: (index < firstDay || index > lastDay) ? 0.3 : 1,
        }}
      />
    );
  });

  return (
    <div className={style.year_chart_month_body}>
      {days}
    </div>
  );
}

Body.defaultProps = {
  rows: [],
};

export default Body;
