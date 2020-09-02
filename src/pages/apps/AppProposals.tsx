import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Typography, makeStyles } from '@material-ui/core';
import CategoryIcon from '@material-ui/icons/Category';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { ProposalOverview } from '../../core/services/proposals.model';
import ProposalOverviewList from './proposals/ProposalOverviewList';
import { getProposals } from '../../core/services/proposals.service';
import { COLOR_STEEL_BLUE, COLOR_CHROMIA_DARK } from '../../core/dynamic-theme/DefaultTheme';

interface MatchParams {
  appName: string;
}

const useStyles = makeStyles({
  filterPanel: {
    marginBottom: '10px',
  },
  filterIcon: {
    color: COLOR_CHROMIA_DARK,
    position: 'relative',
    top: 5,
    marginLeft: '20px',
  },
  filterOption: {
    fontWeight: 'bold',
  },
  optionItem: {
    marginLeft: '5px',
  },
  clickable: {
    cursor: 'pointer',
  },
  clicked: {
    color: COLOR_STEEL_BLUE,
    fontWeight: 'bold',
  },
  separator: {
    marginLeft: '6px',
  },
});

const AppProposals: React.FunctionComponent<RouteComponentProps<MatchParams>> = (props) => {
  const classes = useStyles();

  const [app, setApp] = useState<string>();
  const [proposals, setProposals] = useState<ProposalOverview[]>([]);
  const [includeCore, setIncludeCore] = useState(true);
  const [includeCommunity, setIncludeCommunity] = useState(true);
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [includeInProgress, setIncludeInProgress] = useState(true);

  useEffect(() => {
    const { appName } = props.match.params;
    setApp(appName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let categoryFilter = '';
    if (!includeCommunity) {
      categoryFilter = 'Core';
    } else if (!includeCore) {
      categoryFilter = 'Community';
    }

    let statusFilter = '';
    if (!includeCompleted) {
      statusFilter = 'In Progress';
    } else if (!includeInProgress) {
      statusFilter = 'Completed';
    }

    getProposals(app, categoryFilter, statusFilter).then((p) => setProposals(p));
  }, [app, includeCore, includeCommunity, includeCompleted, includeInProgress]);

  return (
    <div>
      <div className={classes.filterPanel}>
        <Typography variant="body1" component="span" className={classes.filterOption}>
          Filters
        </Typography>
        <CategoryIcon className={classes.filterIcon} />
        <Typography
          variant="body2"
          component="span"
          className={`${classes.optionItem} ${includeCommunity ? classes.clickable : ''} ${
            includeCore ? classes.clicked : ''
          }`}
          onClick={() => {
            if (includeCommunity) {
              setIncludeCore(!includeCore);
            }
          }}
        >
          Core
        </Typography>
        <span className={classes.separator}>•</span>
        <Typography
          variant="body2"
          component="span"
          className={`${classes.optionItem} ${includeCore ? classes.clickable : ''} ${
            includeCommunity ? classes.clicked : ''
          }`}
          onClick={() => {
            if (includeCore) {
              setIncludeCommunity(!includeCommunity);
            }
          }}
        >
          Community
        </Typography>
        <CheckCircleIcon className={classes.filterIcon} />
        <Typography
          variant="body2"
          component="span"
          className={`${classes.optionItem} ${includeInProgress ? classes.clickable : ''} ${
            includeCompleted ? classes.clicked : ''
          }`}
          onClick={() => {
            if (includeInProgress) {
              setIncludeCompleted(!includeCompleted);
            }
          }}
        >
          Completed
        </Typography>
        <span className={classes.separator}>•</span>
        <Typography
          variant="body2"
          component="span"
          className={`${classes.optionItem} ${includeCompleted ? classes.clickable : ''} ${
            includeInProgress ? classes.clicked : ''
          }`}
          onClick={() => {
            if (includeCompleted) {
              setIncludeInProgress(!includeInProgress);
            }
          }}
        >
          In Progress
        </Typography>
      </div>
      <ProposalOverviewList proposals={proposals} />
    </div>
  );
};

export default AppProposals;