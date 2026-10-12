-- 친구 퀴즈(friend-quiz.html)용 테이블
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 하면 됩니다. (한 번만 실행)

create table if not exists public.friend_quizzes (
  id            text primary key check (id ~ '^[a-z0-9]{8}$'),
  owner_name    text not null check (char_length(owner_name) between 1 and 12),
  question_ids  smallint[] not null check (array_length(question_ids, 1) = 10),
  answers       smallint[] not null check (array_length(answers, 1) = 10),
  created_at    timestamptz not null default now()
);

create table if not exists public.friend_quiz_results (
  id            bigint generated always as identity primary key,
  quiz_id       text not null references public.friend_quizzes(id) on delete cascade,
  player_name   text not null check (char_length(player_name) between 1 and 12),
  score         smallint not null check (score between 0 and 10),
  created_at    timestamptz not null default now()
);

create index if not exists friend_quiz_results_quiz_idx
  on public.friend_quiz_results (quiz_id, score desc, created_at);

-- 누구나 퀴즈를 만들고, 풀고, 결과판을 볼 수 있음. 수정·삭제는 불가.
alter table public.friend_quizzes enable row level security;
alter table public.friend_quiz_results enable row level security;

drop policy if exists "friend_quizzes read" on public.friend_quizzes;
drop policy if exists "friend_quizzes insert" on public.friend_quizzes;
drop policy if exists "friend_quiz_results read" on public.friend_quiz_results;
drop policy if exists "friend_quiz_results insert" on public.friend_quiz_results;

create policy "friend_quizzes read" on public.friend_quizzes for select using (true);
create policy "friend_quizzes insert" on public.friend_quizzes for insert with check (true);
create policy "friend_quiz_results read" on public.friend_quiz_results for select using (true);
create policy "friend_quiz_results insert" on public.friend_quiz_results for insert with check (true);
