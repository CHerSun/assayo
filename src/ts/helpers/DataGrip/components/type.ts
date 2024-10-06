import ICommit from 'ts/interfaces/Commit';
import IHashMap from 'ts/interfaces/HashMap';
import { createIncrement, increment } from 'ts/helpers/Math';
import { POPULAR_TYPES } from 'ts/helpers/Parser/getTypeAndScope';

export default class DataGripByType {
  list: string[] = [];

  commits: IHashMap<any> = {};

  statistic: any = [];

  clear() {
    this.list = [];
    this.commits = {};
    this.statistic = [];
  }

  addCommit(commit: ICommit) {
    if (this.commits.hasOwnProperty(commit.type)) {
      this.#updateCommitByType(commit);
    } else {
      this.#addCommitByType(commit);
    }
  }

  #updateCommitByType(commit: ICommit) {
    const statistic = this.commits[commit.type];
    statistic.commits += 1;
    statistic.days[commit.timestamp] = true;
    statistic.tasks[commit.task] = true;

    increment(statistic.commitsByAuthors, commit.author);
    if (!statistic.daysByAuthors[commit.author]) statistic.daysByAuthors[commit.author] = {};
    increment(statistic.daysByAuthors[commit.author], commit.timestamp);
  }

  #addCommitByType(commit: ICommit) {
    this.commits[commit.type] = {
      type: commit.type,
      commits: 1,
      days: createIncrement(commit.timestamp, true),
      tasks: createIncrement(commit.task, true),
      commitsByAuthors: createIncrement(commit.author, true),
      daysByAuthors: {
        [commit.author]: createIncrement(commit.timestamp, true),
      },
    };
  }

  updateTotalInfo() {
    const types = [...POPULAR_TYPES, 'ci'];
    const isCorrectType = Object.fromEntries(types.map(type => [type, true]));

    this.statistic = Object.values(this.commits)
      .filter((dot: any) => dot.commits > 5 || isCorrectType[dot?.type || ''])
      .map((dot: any) => ({
        ...dot,
        tasks: Object.keys(dot.tasks).length,
        days: Object.keys(dot.days).length,
        daysByAuthorsTotal: Object.values(dot.daysByAuthors)
          .reduce((t: number, v: any) => (t + Object.keys(v).length), 0),
      }))
      .sort((dotA, dotB) => dotB.days - dotA.days);

    this.list = this.statistic.map((dot: any) => dot.type);
  }
}
