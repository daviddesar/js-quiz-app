import Box from '@mui/material/Box';
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
import Menu from '../../components/Menu/index';

export const Container = styled(Card)({
  borderRadius: '24px',
  backgroundColor: '#1d1c22',
  border: '2px solid #5A5A5A',
  width: 600,
  padding: '32px',
});

export default function Home() {
  const [data, setData] = useState<Question[]>();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const router = useRouter();
  const { query, pathname } = router;
  const setQuestion = () => {
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
    if (router) {
      setQuestion();
    }
  }, []);
  useEffect(() => {
    if (router && data) {
      setQuestion();
    }
  }, [Number(query.id)]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0b0e',
      }}
    >
      <Head>
        <title>JS quiz</title>
      </Head>
      <div>
        <Menu />
        <Container>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
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
          </Box>

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
        </Container>
      </div>
    </div>
  );
}
