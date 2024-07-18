import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Title from 'ts/components/Title';
import dataGripStore from 'ts/store/DataGrip';
import fullScreen from 'ts/store/FullScreen';

import SectionSlider from 'ts/pages/PageWrapper/components/SectionSlider';
import printStore from 'ts/pages/PageWrapper/store/Print';

import UserSelect from './components/UserSelect';
import Changes from './components/Changes';
import Commits from './components/Commits';
import Hours from './components/Hours';
import Money from './components/Money';
import PopularWords from './components/PopularWords';
import Speed from './components/Speed';
import Total from './components/Total';
import Week from './components/Week';
import Month from './components/Month';
import Tasks from './components/Tasks';
import Tempo from './components/Tempo';
import Print from './components/Print';

interface IPersonProps {
  userId?: string | number;
}

function getViewByIdByUser(user: any, filters: any) {
  return function getViewById(page?: string) {
    let mode = undefined;
    if (fullScreen.isOpen) mode = 'fullscreen';
    if (printStore.processing) mode = 'print';

    if (page === 'total') return <Total user={user}/>;
    if (page === 'money') return <Money user={user}/>;
    if (page === 'week') return (
      <Week
        user={user}
        mode={mode}
      />
    );
    if (page === 'month') return <Month user={user}/>;
    if (page === 'hours') return <Hours user={user}/>;
    if (page === 'commits') return <Commits user={user}/>;
    if (page === 'changes') return <Changes user={user}/>;
    if (page === 'words') return (
      <PopularWords
        user={user}
        mode={mode}
      />
    );
    if (page === 'speed') return <Speed user={user}/>;
    if (page === 'day') return (
      <Tempo
        user={user}
        filters={filters}
      />
    );
    if (page === 'print') return <Print user={user}/>;
    if (page === 'tasks') return <Tasks user={user}/>;
    return <Total user={user}/>;
  };
}

const Person = observer(({
  userId,
}: IPersonProps) => {
  const { t } = useTranslation();
  const { type, page, userId: userIdFromUrl } = useParams<any>();

  const rows = dataGripStore.dataGrip.timestamp.statistic.allCommitsByTimestamp || [];
  const defaultWeek = rows.length
    ? rows[rows.length - 1].week
    : 0;
  const [filters, setFilters] = useState<any>({ week: defaultWeek });

  const user = dataGripStore.dataGrip.author.statistic[userId || userIdFromUrl || 0];
  if (type !== 'person' || !user) return null;

  const getViewById = getViewByIdByUser(user, filters);
  return (
    <>
      {page !== 'print' && (
        <>
          <Title title={t('common.filters')} />
          <UserSelect
            filters={filters}
            onChange={setFilters}
          />
        </>
      )}
      <SectionSlider getViewById={getViewById} />
    </>
  );
});

export default Person;
