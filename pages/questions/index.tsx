import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useEffect, useState } from 'react';
import QuestionCard from '../../components/QuestionCard';
import {
  Question,
  GITHUB_RAW_DATA_LINK,
  getQuestionsFromRawString,
  transformQuestion,
} from '../../utils/';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Bars } from 'react-loader-spinner';

export const Container = styled(Card)({
  borderRadius: '24px',
  backgroundColor: '#1d1c22',
  border: '2px solid #5A5A5A',
  width: 500,
  padding: '32px',
});

export default function Home() {
  const [data, setData] = useState<Question[]>();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { query, pathname } = router;
  const setQuestion = () => {
    setIsLoading(true);
    if (!query.id || Number(query.id) < 1) {
      query.id = '1';
      router.push({
        pathname,
        query: { ...query },
      });
    }
    if (data) {
      setCurrentQuestion(
        data.find((it) => it.id === Number(query.id) - 1) || null
      );
    }
    setIsLoading(false);
  };
  const navigateQuestion = (isForward: boolean) => {
    if (isForward) {
      router.push({
        pathname,
        query: {
          id:
            Number(query.id) + 1 > Number(data?.length)
              ? data?.length.toString()
              : Number(query.id) + 1,
        },
      });
    } else {
      router.push({
        pathname,
        query: {
          id:
            Number(query.id) - 1 > 0 ? (Number(query.id) - 1).toString() : '1',
        },
      });
    }
  };

  const getData = async () => {
    const rawData = localStorage.getItem('rawQuestionsData');
    if (!rawData) {
      const res = await fetch(GITHUB_RAW_DATA_LINK, {
        method: 'GET',
      }).then((res) => res.text());
      const questions = getQuestionsFromRawString(res);
      localStorage.setItem('rawQuestionsData', JSON.stringify(questions));
      setData(questions.map((it, index) => transformQuestion(it, index)));
    } else {
      setData(
        JSON.parse(rawData).map((it: string, index: number) =>
          transformQuestion(it, index)
        )
      );
    }
  };

  useEffect(() => {
    getData();
    if (data && router.isReady) {
      setQuestion();
    }
  }, [Number(query.id), data?.length]);
  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: '100vh',
        borderRadius: 'unset',
        backgroundColor: '#0a0b0e',
      }}
    >
      <Head>
        <title>JS quiz</title>
      </Head>
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Bars
            height="80"
            width="80"
            color="white"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <Grid
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          container
          sx={{
            paddingTop: 2,
            paddingBottom: 2,
          }}
        >
          <Grid
            item
            lg={5}
            md={6}
            xs={11}
            sx={{
              width: '100%',
              backgroundColor: '#292929',
              paddingTop: 3,
              paddingBottom: 3,
              paddingLeft: 4,
              paddingRight: 4,
              borderRadius: 2,
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              sx={{
                color: 'white',
                marginBottom: 2,
              }}
            >
              <IconButton
                onClick={() => navigateQuestion(false)}
                sx={{ margin: 0, padding: 0 }}
                color="inherit"
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={() => navigateQuestion(true)}
                sx={{ margin: 0, padding: 0 }}
                color="inherit"
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>

            {data && currentQuestion && (
              <QuestionCard
                title={currentQuestion.title || ''}
                question={currentQuestion.questionContent || ''}
                keyOptions={currentQuestion.options}
                correctAnswer={currentQuestion.answer || ''}
                explain={currentQuestion.explain || ''}
                id={currentQuestion.id}
              />
            )}
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}
