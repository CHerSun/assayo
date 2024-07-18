import React from 'react';
import { observer } from 'mobx-react-lite';

import dataGripStore from 'ts/store/DataGrip';

import Recommendations from 'ts/components/Recommendations';
import HoursChart from 'ts/components/HoursChart';
import Title from 'ts/components/Title';

import ICommonPageProps from 'ts/components/Page/interfaces/CommonPageProps';
import PageWrapper from 'ts/components/Page/wrapper';

const Hours = observer(({
  mode,
}: ICommonPageProps): React.ReactElement => {
  const statistic = dataGripStore.dataGrip.team.statistic;
  const recommendations = dataGripStore.dataGrip.recommendations.team?.byHour;

  return (
    <>
      {mode !== 'fullscreen' && (
        <Recommendations
          mode={mode}
          recommendations={recommendations}
        />
      )}
      <Title title="page.team.hours.title"/>
      <PageWrapper template="table">
        <HoursChart statistic={statistic} />
      </PageWrapper>
    </>
  );
});

export default Hours;
