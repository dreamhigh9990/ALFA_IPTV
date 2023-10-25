import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
//
import AnalyticsNews from '../analytics-news';
import AnalyticsTasks from '../analytics-tasks';
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsOrderTimeline from '../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsConversionRates from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const [tableData,setTableData]=useState([0,0,0,0]);
  useEffect(() => {
    // const authToken =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInVzZXJfaXAiOiIyMTMuMTQuMTkyLjIwMiIsImVtYWlsIjoiZGVtb3VzZXJAZ21haWwuY29tIiwiand0X2V4cGlyZSI6MTY5NzY3MTQ4Nn0.CkFq8VOTIQ9btY0ryOE__UGnEO6WSlo_S0L6g_ImojnNOyCrAZDHGdJ_E6p68suqJ7D1lIoa2veM0dV4nh1FEC3Qx5HaXPon90nrKR15x743LbAjp7aIvDjFDGoA9u8mSRvW7fZozX-XkS3p6QGPwfLlpyii6HNjLGHBfEWWq6PkE1eQVbEfEHxUnDjvEW3f4C_1I-L2zdzd2B_Ont2WW9idAXmeaZQl2AFlqf19iDb2_eOIuP_TJWjN_DJLPgSMliFwMdILLu8560soTFADibPYHM041Or5kJdJHcioddOBPmv1bFx2c5C0bqj6G0NTAgde5rYtspgP95T8DPK_zNHdMnYEBxL7zPJXTwIkpvoeTc4t3xoSEomyJZeq1lVmb92Xx-7Mkp8BicnIT-9WpuSGhZTrU8qks2uiu5LWL3wbS0RlNSm9v0FkQAaGKNo1r5q3iUI82ZyEPfX9uVZD0iummxCL3emenOQPuKAKTwfS3ISp8Tt9VKDslliRICPd7i-KXq0IZ8vmwTcijUIAhxwaUb3Gyu9yF3s6eejjmKon8_nMC0X6GJjqEZsdSIQaE6I4Txs1LMiY0BtM6Z_modOIxh1YdH1_xUggjKkI4FY8RJEHGrRR9CfeWd48WZzKwELKKFT45VHizNOCw0Cfbo-Je_a0wmWso8Q91ranrLw';
    
      const authToken = sessionStorage.getItem('accessToken');

    axios
      .get('http://194.233.175.49/api/v2/account/stats', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Adjust this based on your API's requirement
          Authorization: authToken,
        },
      })
      .then((response) => {
        // Perform actions based on the response here
        console.log('Get Users', response.data);

        // const arrary = response.data;
        // const ttt = arrary?.map((t) => ({ ...t, id: t.username }));
        setTableData(response.data);
      })
      .catch((error) => {
        // Handle login failure or errors
        console.error('Get Users failed:', error);
      });
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Users"
            total={tableData.users}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Credit"
            total={tableData.credit}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Balance"
            total={tableData.balance}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Invitations"
            total={tableData.invitees}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="Points"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_analyticPosts} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite title="Traffic by Site" list={_analyticTraffic} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_analyticTasks} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
