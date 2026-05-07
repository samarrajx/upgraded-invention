// js/data.js — Career OS task data (auto-generated from original roadmap)

export const SKILL_COLORS = {
  python:   { bg:'var(--s-py-bg)', tx:'var(--s-py-tx)', pr:'var(--s-py-pr)' },
  dsa:      { bg:'var(--s-ds-bg)', tx:'var(--s-ds-tx)', pr:'var(--s-ds-pr)' },
  english:  { bg:'var(--s-en-bg)', tx:'var(--s-en-tx)', pr:'var(--s-en-pr)' },
  math:     { bg:'var(--s-ma-bg)', tx:'var(--s-ma-tx)', pr:'var(--s-ma-pr)' },
  projects: { bg:'var(--s-pr-bg)', tx:'var(--s-pr-tx)', pr:'var(--s-pr-pr)' },
  interview:{ bg:'var(--s-in-bg)', tx:'var(--s-in-tx)', pr:'var(--s-in-pr)' },
};

function xp(t){ const n=parseInt(t)||30; return n<=15?5:n<=25?8:n<=35?12:n<=50?15:20; }

function addXP(months){
  return months.map(m=>({...m, weeks: m.weeks.map(w=>({...w, tasks: w.tasks.map(t=>({...t, xp:xp(t.time)}))}))}));
}

export const RULE = 'No AI for code during practice. Write every line yourself.';

const rawMonths =
[
  {
    id:'m1',badge:'Month 1',title:'Python from scratch + Math foundations',
    color:'#E6F1FB',txt:'#0C447C',prog:'#185FA5',skills:['python','math','english'],
    weeks:[
      {label:'Week 1 — Python: variables & logic',skill:'python',tasks:[
        {t:'Install Python + VS Code. Run print("Samar") yourself.',s:'No AI. You type every character.',time:'45 min'},
        {t:'Learn variables. Store your name, age, city. Print them.',s:'',time:'30 min'},
        {t:'Learn if/elif/else. Write: if marks>60 print("pass") else print("fail")',s:'',time:'30 min'},
        {t:'Learn input(). Ask user for a number, print if it is odd or even.',s:'Think the logic first, then type.',time:'30 min'},
        {t:'Write 5 small programs from your head. No copying.',s:'Grade checker, age calculator, anything.',time:'45 min'},
      ]},
      {label:'Week 2 — Python: loops',skill:'python',tasks:[
        {t:'Learn for loops. Print 1 to 20 without typing each number.',s:'',time:'30 min'},
        {t:'Learn while loops. Print numbers until user types 0.',s:'',time:'30 min'},
        {t:'Use a loop to find the largest number in a list of 5 numbers.',s:'No max(). Write the logic yourself.',time:'45 min'},
        {t:'Print multiplication table of any number user enters.',s:'',time:'30 min'},
        {t:'Count how many numbers in a list are above 50. No COUNTIF.',s:'Loop through. Check each. Count.',time:'30 min'},
      ]},
      {label:'Week 3 — Math: number sense',skill:'math',tasks:[
        {t:'Khan Academy: whole numbers, fractions, percentages. Do all exercises.',s:'khanacademy.org — free.',time:'45 min'},
        {t:'Learn what a variable means in algebra. Solve 5 equations by hand.',s:'x + 3 = 7. Find x. No calculator.',time:'30 min'},
        {t:'Learn ratios and proportions. Solve 10 problems.',s:'',time:'30 min'},
        {t:'Learn mean, median, mode. Calculate for a list of 10 numbers by hand.',s:'',time:'30 min'},
        {t:'Write a Python program that calculates mean and median without using any library.',s:'Pure logic. No statistics module.',time:'45 min'},
      ]},
      {label:'Week 4 — English: daily habit',skill:'english',tasks:[
        {t:'Start watching one 10-min YouTube video in English daily. No subtitles.',s:'BBC Learning English channel. Start today.',time:'10 min'},
        {t:'Write 5 sentences in English about your day. Every day this week.',s:'Do not translate from Hindi. Think in English.',time:'10 min'},
        {t:'Read one paragraph of any English tech article aloud.',s:'geeksforgeeks.org or any blog.',time:'10 min'},
        {t:'Learn 5 new English words daily. Write them, use them in a sentence.',s:'',time:'10 min'},
        {t:'Record yourself speaking English for 1 minute. Listen back.',s:'Uncomfortable. Do it anyway.',time:'10 min'},
      ]},
    ],
    win:'You can write Python programs from scratch. Math habit started. English habit started.',
    rule:RULE,
  },
  {
    id:'m2',badge:'Month 2',title:'Python functions + lists + basic DSA thinking',
    color:'#FAECE7',txt:'#712B13',prog:'#993C1D',skills:['python','dsa','english','math'],
    weeks:[
      {label:'Week 5 — Python: functions & lists',skill:'python',tasks:[
        {t:'Learn functions. Write a function that takes two numbers and returns their sum.',s:'def add(a, b): return a + b',time:'30 min'},
        {t:'Write a function that finds the largest number in a list.',s:'No max(). Write the logic inside the function.',time:'45 min'},
        {t:'Learn lists: add, remove, access by index, loop through.',s:'',time:'30 min'},
        {t:'Write a function that removes duplicates from a list without using set().',s:'Think how you would do it manually first.',time:'45 min'},
        {t:'Write a function that reverses a list without using .reverse().',s:'',time:'30 min'},
      ]},
      {label:'Week 6 — Python: strings & dictionaries',skill:'python',tasks:[
        {t:'Learn string operations: split, join, upper, lower, strip, replace.',s:'',time:'30 min'},
        {t:'Write a program that counts how many times each word appears in a sentence.',s:'No Counter library. Use a dictionary.',time:'45 min'},
        {t:'Learn dictionaries. Store 5 agent names and their transaction counts.',s:'',time:'30 min'},
        {t:'Write a function that finds the agent with highest transactions from a dictionary.',s:'',time:'30 min'},
        {t:'Write a program that checks if a word is a palindrome.',s:'',time:'30 min'},
      ]},
      {label:'Week 7 — DSA: what it actually is',skill:'dsa',tasks:[
        {t:'Understand what an array/list is in memory. Read, do not code yet.',s:'geeksforgeeks.org/array-data-structure',time:'30 min'},
        {t:'Implement linear search in Python from scratch. No libraries.',s:'Loop through, check each element.',time:'30 min'},
        {t:'Understand time complexity intuitively. Why does 10,000 agents make manual check slow?',s:'Connect to your own test answer from earlier.',time:'30 min'},
        {t:'Implement binary search. Understand why the list must be sorted first.',s:'',time:'45 min'},
        {t:'Write both searches. Compare how many steps each takes on a list of 100 items.',s:'',time:'30 min'},
      ]},
      {label:'Week 8 — Math + English',skill:'math',tasks:[
        {t:'Khan Academy: intro to algebra. Complete all exercises in the unit.',s:'',time:'45 min'},
        {t:'Learn what a function is in math (y = 2x + 1). Plot 5 points by hand.',s:'',time:'30 min'},
        {t:'English: Speak for 2 minutes in English about what you learned this week.',s:'Record it. Do not read from notes.',time:'15 min'},
        {t:'English: Write a short paragraph explaining linear search in English.',s:'If you can explain it, you understand it.',time:'15 min'},
        {t:'Learn powers and logarithms basics. Why does log matter in DSA?',s:'',time:'30 min'},
      ]},
    ],
    win:'You can write functions, work with lists and dictionaries, and understand what DSA is.',
    rule:RULE,
  },
  {
    id:'m3',badge:'Month 3',title:'DSA seriously begins + Python files',
    color:'#EEEDFE',txt:'#3C3489',prog:'#534AB7',skills:['python','dsa','english','math'],
    weeks:[
      {label:'Week 9 — Sorting algorithms',skill:'dsa',tasks:[
        {t:'Understand bubble sort. Trace through it by hand on paper first.',s:'5 numbers. Sort manually. Then code it.',time:'45 min'},
        {t:'Implement bubble sort in Python. No libraries.',s:'',time:'30 min'},
        {t:'Understand selection sort. Trace by hand. Then code it.',s:'',time:'45 min'},
        {t:'Understand insertion sort. Trace by hand. Then code it.',s:'',time:'45 min'},
        {t:'Compare all three on a list of 10 numbers. Count their steps.',s:'',time:'30 min'},
      ]},
      {label:'Week 10 — Python: files & error handling',skill:'python',tasks:[
        {t:'Learn to read a .txt file line by line in Python.',s:'',time:'30 min'},
        {t:'Learn to write output to a file.',s:'',time:'20 min'},
        {t:'Learn try/except. Handle file not found error gracefully.',s:'',time:'30 min'},
        {t:'Write a program that reads a CSV manually (no pandas) and prints each row.',s:'Split by comma. That is all a CSV is.',time:'45 min'},
        {t:'Write a program that reads agent names + transactions from a file and finds the top performer.',s:'',time:'45 min'},
      ]},
      {label:'Week 11 — Math: functions & graphs',skill:'math',tasks:[
        {t:'Khan Academy: functions unit. Complete all exercises.',s:'',time:'45 min'},
        {t:'Learn slope of a line. Calculate slope between 5 pairs of points.',s:'',time:'30 min'},
        {t:'Understand what O(n) and O(n²) means using graph intuition.',s:'Draw both curves. See why O(n²) is bad.',time:'30 min'},
        {t:'Learn basic probability. If 3 of 10 agents fail, what is the probability of failure?',s:'',time:'30 min'},
        {t:'Write a Python program that simulates rolling a dice 1000 times and counts each outcome.',s:'',time:'30 min'},
      ]},
      {label:'Week 12 — English push',skill:'english',tasks:[
        {t:'Watch one English movie or show episode with English subtitles.',s:'Not Hindi dub. English audio, English subs.',time:'45 min'},
        {t:'Summarize what you watched in 5 English sentences. Write it down.',s:'',time:'15 min'},
        {t:'Read one full English article from The Hindu or BBC. Understand every sentence.',s:'Look up words you do not know.',time:'20 min'},
        {t:'Speak for 3 minutes in English explaining sorting algorithms. Record yourself.',s:'Pretend you are explaining to a friend.',time:'15 min'},
        {t:'Write an email in English to an imaginary interviewer introducing yourself.',s:'Professional tone. No Hindi words.',time:'20 min'},
      ]},
    ],
    win:'You can implement 3 sorting algorithms, read/write files, and explain concepts in English.',
    rule:RULE,
  },
  {
    id:'m4',badge:'Month 4',title:'Stacks, queues, recursion + rebuild project 1',
    color:'#E1F5EE',txt:'#085041',prog:'#0F6E56',skills:['python','dsa','projects','english'],
    weeks:[
      {label:'Week 13 — Stacks & queues',skill:'dsa',tasks:[
        {t:'Understand what a stack is. Implement using a Python list.',s:'push = append, pop = pop. Understand why.',time:'45 min'},
        {t:'Solve: check if brackets are balanced using a stack.',s:'Classic problem. Think before coding.',time:'45 min'},
        {t:'Understand what a queue is. Implement using a Python list.',s:'',time:'30 min'},
        {t:'Understand when to use stack vs queue. Write examples from real life.',s:'Browser history = stack. Print queue = queue.',time:'20 min'},
        {t:'Solve 2 Leetcode Easy problems using stack or queue. No AI.',s:'leetcode.com — filter by Stack, Easy.',time:'45 min'},
      ]},
      {label:'Week 14 — Recursion',skill:'dsa',tasks:[
        {t:'Understand recursion with factorial. Trace the call stack on paper.',s:'Do not code until you can trace it by hand.',time:'30 min'},
        {t:'Implement factorial recursively. Then fibonacci.',s:'',time:'30 min'},
        {t:'Understand the base case. What happens without it?',s:'Let it crash. See the error. Understand it.',time:'20 min'},
        {t:'Solve: reverse a string using recursion.',s:'',time:'30 min'},
        {t:'Solve: power function using recursion. x to the power n.',s:'',time:'30 min'},
      ]},
      {label:'Week 15 — Rebuild project 1',skill:'projects',tasks:[
        {t:'Open your Staff Attendance Manager. Read every file without AI.',s:'Understand what each file does. Take notes.',time:'60 min'},
        {t:'Write down in plain English what the authentication logic does.',s:'If you cannot explain it, you do not own it.',time:'30 min'},
        {t:'Rebuild the user login from scratch in Python. No framework yet.',s:'Username + password stored in a file. Check it.',time:'60 min'},
        {t:'Add a session concept manually: store logged-in user in a variable.',s:'',time:'30 min'},
        {t:'Write a README for this rebuilt version explaining every decision you made.',s:'Your words. Not AI words.',time:'30 min'},
      ]},
      {label:'Week 16 — English: technical speaking',skill:'english',tasks:[
        {t:'Explain recursion in English out loud for 2 minutes. Record it.',s:'',time:'15 min'},
        {t:'Read one page of Clean Code book in English. Summarize aloud.',s:'PDF available free online.',time:'20 min'},
        {t:'Practice answering: "Tell me about yourself" in English. 90 seconds.',s:'Prepare it. Practice 5 times.',time:'20 min'},
        {t:'Write a LinkedIn post in English about what you built this month.',s:'Real post. Publish it.',time:'20 min'},
        {t:'Find one English-speaking developer on Twitter/X. Read their tweets daily.',s:'Passive absorption of technical English.',time:'5 min'},
      ]},
    ],
    win:'You understand recursion, stacks, queues. You partially own your own project.',
    rule:RULE,
  },
  {
    id:'m5',badge:'Month 5',title:'Linked lists + trees + SQL from scratch',
    color:'#FAEEDA',txt:'#633806',prog:'#854F0B',skills:['dsa','python','math'],
    weeks:[
      {label:'Week 17 — Linked lists',skill:'dsa',tasks:[
        {t:'Understand what a linked list is. Draw it on paper.',s:'Node has value + pointer to next node.',time:'30 min'},
        {t:'Implement a singly linked list: Node class + LinkedList class.',s:'insert, delete, print. No libraries.',time:'60 min'},
        {t:'Traverse a linked list and find its length without .length.',s:'',time:'30 min'},
        {t:'Reverse a linked list. Trace on paper first.',s:'',time:'45 min'},
        {t:'Detect a cycle in a linked list. Understand Floyd\'s algorithm.',s:'',time:'30 min'},
      ]},
      {label:'Week 18 — Trees',skill:'dsa',tasks:[
        {t:'Understand what a binary tree is. Draw examples on paper.',s:'',time:'30 min'},
        {t:'Implement a binary tree with insert and inorder traversal.',s:'',time:'60 min'},
        {t:'Understand BFS vs DFS on a tree. Trace both by hand.',s:'',time:'45 min'},
        {t:'Find the height of a binary tree using recursion.',s:'',time:'30 min'},
        {t:'Solve 2 Leetcode Easy tree problems without AI.',s:'',time:'45 min'},
      ]},
      {label:'Week 19 — SQL from scratch',skill:'python',tasks:[
        {t:'Install SQLite. It comes with Python. No extra install needed.',s:'',time:'15 min'},
        {t:'Create a database with a table of agents: id, name, transactions.',s:'Write the SQL by hand.',time:'30 min'},
        {t:'INSERT 10 rows. SELECT all. SELECT where transactions > 50.',s:'',time:'30 min'},
        {t:'Write a JOIN between agents table and transactions table.',s:'',time:'45 min'},
        {t:'Write GROUP BY query to find total transactions per agent.',s:'',time:'30 min'},
      ]},
      {label:'Week 20 — Math: statistics',skill:'math',tasks:[
        {t:'Learn variance and standard deviation. Calculate by hand for 5 numbers.',s:'',time:'30 min'},
        {t:'Learn what a normal distribution is intuitively.',s:'Khan Academy: statistics unit.',time:'30 min'},
        {t:'Learn correlation. Does more training mean more transactions? How to measure?',s:'',time:'30 min'},
        {t:'Write Python: calculate standard deviation without using any library.',s:'',time:'45 min'},
        {t:'Learn basic probability: AND, OR, NOT. Solve 10 problems.',s:'',time:'30 min'},
      ]},
    ],
    win:'You understand linked lists, trees, and can write real SQL from scratch.',
    rule:RULE,
  },
  {
    id:'m6',badge:'Month 6',title:'Leetcode begins + rebuild project 2 + English fluency',
    color:'#FBEAF0',txt:'#72243E',prog:'#993556',skills:['dsa','projects','english'],
    weeks:[
      {label:'Week 21 — Leetcode Easy: arrays & strings',skill:'dsa',tasks:[
        {t:'Solve Leetcode #1 Two Sum. Think before coding. No AI.',s:'',time:'45 min'},
        {t:'Solve Leetcode #9 Palindrome Number.',s:'',time:'30 min'},
        {t:'Solve Leetcode #26 Remove Duplicates from Sorted Array.',s:'',time:'30 min'},
        {t:'Solve Leetcode #14 Longest Common Prefix.',s:'',time:'30 min'},
        {t:'Solve Leetcode #20 Valid Parentheses using stack.',s:'',time:'30 min'},
      ]},
      {label:'Week 22 — Leetcode Easy continued',skill:'dsa',tasks:[
        {t:'Solve Leetcode #21 Merge Two Sorted Lists.',s:'',time:'45 min'},
        {t:'Solve Leetcode #53 Maximum Subarray.',s:'',time:'45 min'},
        {t:'Solve Leetcode #70 Climbing Stairs.',s:'Recognize the recursion pattern.',time:'30 min'},
        {t:'Solve Leetcode #121 Best Time to Buy and Sell Stock.',s:'',time:'30 min'},
        {t:'Review all 9 problems. Can you explain each solution in English?',s:'If no, re-solve it until you can.',time:'45 min'},
      ]},
      {label:'Week 23 — Rebuild project 2',skill:'projects',tasks:[
        {t:'Open BC Performance System. Read the commission engine logic.',s:'Understand what the CSV columns mean.',time:'60 min'},
        {t:'Rebuild the TDS 2% calculation in pure Python. No framework.',s:'Input: amount. Output: amount after TDS.',time:'30 min'},
        {t:'Rebuild the CSV parser in Python without any library.',s:'Read file, split by comma, extract columns.',time:'60 min'},
        {t:'Write unit tests for your TDS calculator. Does it handle edge cases?',s:'What if amount is 0? Negative? String?',time:'30 min'},
        {t:'Document every function you wrote. Explain the why, not just the what.',s:'',time:'30 min'},
      ]},
      {label:'Week 24 — English: interview simulation',skill:'english',tasks:[
        {t:'Answer "Tell me about yourself" in English. 2 minutes. Record.',s:'',time:'15 min'},
        {t:'Answer "What is a linked list?" in English without notes. Record.',s:'',time:'10 min'},
        {t:'Answer "Describe a project you built" in English. Use BC Performance System.',s:'Speak slowly and clearly. Do not rush.',time:'15 min'},
        {t:'Write 3 answers to common HR questions in English. Polish them.',s:'Strength, weakness, why this company.',time:'20 min'},
        {t:'Find one peer online to do a mock English conversation with.',s:'Pramp.com has free mock interviews.',time:'30 min'},
      ]},
    ],
    win:'25 Leetcode Easy solved. Two projects partially owned. English interview answers prepared.',
    rule:RULE,
  },
  {
    id:'m7',badge:'Month 7',title:'Hashing + heaps + Python OOP',
    color:'#E6F1FB',txt:'#0C447C',prog:'#185FA5',skills:['dsa','python','english'],
    weeks:[
      {label:'Week 25 — Hashing',skill:'dsa',tasks:[
        {t:'Understand what a hash table is and why it is O(1) average lookup.',s:'',time:'30 min'},
        {t:'Implement a basic hash map in Python from scratch.',s:'No dict. Build it yourself.',time:'60 min'},
        {t:'Solve Leetcode #242 Valid Anagram using hashing.',s:'',time:'30 min'},
        {t:'Solve Leetcode #217 Contains Duplicate.',s:'',time:'20 min'},
        {t:'Solve Leetcode #383 Ransom Note.',s:'',time:'20 min'},
      ]},
      {label:'Week 26 — Heaps',skill:'dsa',tasks:[
        {t:'Understand what a heap is. Min-heap vs max-heap.',s:'',time:'30 min'},
        {t:'Use Python heapq module. Find top 3 agents by transactions.',s:'',time:'30 min'},
        {t:'Understand why heap gives O(log n) insert vs O(n) for sorted list.',s:'',time:'20 min'},
        {t:'Solve Leetcode #703 Kth Largest Element in a Stream.',s:'',time:'45 min'},
        {t:'Solve Leetcode #1046 Last Stone Weight.',s:'',time:'30 min'},
      ]},
      {label:'Week 27 — Python OOP',skill:'python',tasks:[
        {t:'Learn classes. Create a BankAccount class with deposit and withdraw methods.',s:'',time:'45 min'},
        {t:'Learn inheritance. Create SavingsAccount that extends BankAccount.',s:'',time:'30 min'},
        {t:'Understand encapsulation. Make balance private. Only change via methods.',s:'',time:'30 min'},
        {t:'Rebuild your Agent class from BC System using proper OOP.',s:'Agent has name, zone, transactions, methods.',time:'45 min'},
        {t:'Write a simple unittest for your Agent class.',s:'',time:'30 min'},
      ]},
      {label:'Week 28 — English & communication',skill:'english',tasks:[
        {t:'Speak about your day in English for 5 minutes. Record daily.',s:'',time:'10 min'},
        {t:'Watch one English developer conference talk on YouTube.',s:'Google I/O, PyCon, anything technical.',time:'30 min'},
        {t:'Write a cold email in English to a developer whose work you respect.',s:'You do not have to send it. Just write it well.',time:'20 min'},
        {t:'Practice explaining OOP concepts in English. Record 3-minute video.',s:'',time:'15 min'},
        {t:'Read 2 pages of an English tech book daily this week.',s:'',time:'15 min'},
      ]},
    ],
    win:'You understand hashing, heaps, and can write OOP Python properly.',
    rule:RULE,
  },
  {
    id:'m8',badge:'Month 8',title:'Graphs + dynamic programming intro',
    color:'#FAECE7',txt:'#712B13',prog:'#993C1D',skills:['dsa','math','english'],
    weeks:[
      {label:'Week 29 — Graphs basics',skill:'dsa',tasks:[
        {t:'Understand what a graph is. Nodes + edges. Directed vs undirected.',s:'Draw 5 examples from real life.',time:'30 min'},
        {t:'Implement a graph using adjacency list in Python.',s:'',time:'45 min'},
        {t:'Implement BFS on a graph.',s:'',time:'45 min'},
        {t:'Implement DFS on a graph.',s:'',time:'30 min'},
        {t:'Solve Leetcode #200 Number of Islands.',s:'Classic BFS/DFS problem.',time:'45 min'},
      ]},
      {label:'Week 30 — Graphs continued',skill:'dsa',tasks:[
        {t:'Solve Leetcode #133 Clone Graph.',s:'',time:'45 min'},
        {t:'Understand what a cycle in a graph means.',s:'',time:'20 min'},
        {t:'Solve Leetcode #207 Course Schedule. Detect cycle in directed graph.',s:'',time:'60 min'},
        {t:'Understand Dijkstra\'s shortest path algorithm conceptually.',s:'You do not need to implement fully yet.',time:'30 min'},
        {t:'Write out BFS and DFS without looking at notes.',s:'If you cannot, practice more.',time:'30 min'},
      ]},
      {label:'Week 31 — Dynamic programming intro',skill:'dsa',tasks:[
        {t:'Understand memoization. Fibonacci with memo vs without. Compare steps.',s:'',time:'45 min'},
        {t:'Understand bottom-up DP. Fibonacci iteratively with a table.',s:'',time:'30 min'},
        {t:'Solve Leetcode #70 Climbing Stairs using DP.',s:'',time:'30 min'},
        {t:'Solve Leetcode #118 Pascal\'s Triangle.',s:'',time:'30 min'},
        {t:'Solve Leetcode #198 House Robber.',s:'Classic DP. Think before coding.',time:'45 min'},
      ]},
      {label:'Week 32 — Math for interviews',skill:'math',tasks:[
        {t:'Learn modular arithmetic. Why does (a+b) % n = ((a%n) + (b%n)) % n?',s:'',time:'30 min'},
        {t:'Learn bit manipulation basics: AND, OR, XOR, left shift, right shift.',s:'',time:'30 min'},
        {t:'Solve Leetcode #191 Number of 1 Bits.',s:'',time:'20 min'},
        {t:'Learn combinatorics: permutations and combinations. Solve 5 problems.',s:'',time:'30 min'},
        {t:'English: Explain dynamic programming in English to an imaginary non-coder.',s:'Record it. If they would understand, you pass.',time:'15 min'},
      ]},
    ],
    win:'You can solve graph problems. You understand DP. These appear in every product company interview.',
    rule:RULE,
  },
  {
    id:'m9',badge:'Month 9',title:'50 Leetcode Easy done + rebuild project 3 fully',
    color:'#EEEDFE',txt:'#3C3489',prog:'#534AB7',skills:['dsa','projects','english'],
    weeks:[
      {label:'Week 33–34 — Leetcode sprint',skill:'dsa',tasks:[
        {t:'Solve 10 new Leetcode Easy problems. Any topic.',s:'Track every problem in a notebook.',time:'60 min/day'},
        {t:'For every problem: write your thought process in English before coding.',s:'This trains interview communication.',time:'15 min/problem'},
        {t:'Review every problem you struggled with. Re-solve from memory.',s:'',time:'30 min'},
        {t:'Time yourself. Aim for Easy problems in under 20 minutes.',s:'',time:''},
        {t:'Total so far: 50 Leetcode Easy. This is the foundation.',s:'Do not skip to Medium yet.',time:''},
      ]},
      {label:'Week 35 — Rebuild BC System core',skill:'projects',tasks:[
        {t:'Rebuild the agent data model in Python using OOP.',s:'Agent class with all fields from the real system.',time:'60 min'},
        {t:'Rebuild the commission calculation logic in pure Python.',s:'No Supabase. No framework. Raw logic.',time:'60 min'},
        {t:'Write a CSV importer: read agent data from file, create Agent objects.',s:'',time:'45 min'},
        {t:'Write unit tests for commission calculation. Cover edge cases.',s:'',time:'30 min'},
        {t:'Push this Python version to GitHub with your own README.',s:'This is yours. Not AI-assisted.',time:'20 min'},
      ]},
      {label:'Week 36 — Communication + GitHub',skill:'english',tasks:[
        {t:'Record a 5-minute video explaining your rebuilt BC system in English.',s:'Like a demo. Natural, not scripted.',time:'30 min'},
        {t:'Write a detailed GitHub README in English for your rebuilt project.',s:'Problem, solution, how to run, what you learned.',time:'30 min'},
        {t:'Answer mock interview questions on video: DSA + project + behavioral.',s:'',time:'30 min'},
        {t:'Read your README aloud. Does it sound professional? Fix it.',s:'',time:'15 min'},
        {t:'Post a LinkedIn update about completing 50 Leetcode problems.',s:'Short, honest, in English.',time:'15 min'},
      ]},
    ],
    win:'50 Leetcode Easy done. BC System rebuilt in Python. You own it now.',
    rule:RULE,
  },
  {
    id:'m10',badge:'Month 10',title:'Leetcode Medium begins + system design intro',
    color:'#E1F5EE',txt:'#085041',prog:'#0F6E56',skills:['dsa','projects','english'],
    weeks:[
      {label:'Week 37–38 — Leetcode Medium: sliding window & two pointers',skill:'dsa',tasks:[
        {t:'Learn sliding window pattern. Solve #3 Longest Substring Without Repeating.',s:'',time:'60 min'},
        {t:'Solve #424 Longest Repeating Character Replacement.',s:'',time:'45 min'},
        {t:'Learn two pointer pattern. Solve #167 Two Sum II.',s:'',time:'30 min'},
        {t:'Solve #15 Three Sum.',s:'Hard Medium. Take your time.',time:'60 min'},
        {t:'Solve #11 Container With Most Water.',s:'',time:'45 min'},
      ]},
      {label:'Week 39 — System design: basics',skill:'projects',tasks:[
        {t:'Understand what system design means. Read: what happens when you type google.com.',s:'',time:'30 min'},
        {t:'Learn what a database index is and why it speeds up queries.',s:'Connect this to your Supabase experience.',time:'30 min'},
        {t:'Learn what caching is. Redis concept. When would you use it?',s:'',time:'30 min'},
        {t:'Learn what a REST API is from first principles. You used one. Now understand it.',s:'',time:'30 min'},
        {t:'Draw the architecture of your BC System from memory. Label every component.',s:'If you cannot draw it, you did not own it.',time:'30 min'},
      ]},
      {label:'Week 40 — English: technical interview prep',skill:'english',tasks:[
        {t:'Do a full mock interview in English on Pramp.com.',s:'Free peer mock interviews.',time:'60 min'},
        {t:'Practice explaining a Medium Leetcode solution in English clearly.',s:'Interviewer must understand your approach.',time:'20 min'},
        {t:'Write answers to 10 behavioral interview questions in English.',s:'STAR format for each.',time:'30 min'},
        {t:'Read them aloud until they sound natural, not memorized.',s:'',time:'20 min'},
        {t:'Record a mock system design explanation for BC Performance System.',s:'',time:'20 min'},
      ]},
    ],
    win:'You can solve Leetcode Medium problems. You understand system design basics.',
    rule:RULE,
  },
  {
    id:'m11',badge:'Month 11',title:'100 Leetcode problems + open source contribution',
    color:'#FAEEDA',txt:'#633806',prog:'#854F0B',skills:['dsa','projects','english'],
    weeks:[
      {label:'Week 41–42 — Leetcode Medium sprint',skill:'dsa',tasks:[
        {t:'Solve 10 more Medium problems. Focus on binary search and trees.',s:'',time:'60 min/day'},
        {t:'Solve #98 Validate Binary Search Tree.',s:'',time:'45 min'},
        {t:'Solve #102 Binary Tree Level Order Traversal.',s:'',time:'45 min'},
        {t:'Solve #33 Search in Rotated Sorted Array.',s:'',time:'45 min'},
        {t:'Total: 100 Leetcode problems. Mark this milestone.',s:'Most candidates stop at 30.',time:''},
      ]},
      {label:'Week 43 — Open source',skill:'projects',tasks:[
        {t:'Find a small open source Python or JS project on GitHub with good issues.',s:'Search: good first issue label.',time:'30 min'},
        {t:'Read the codebase. Understand it without AI.',s:'Take notes. Ask questions via GitHub issues.',time:'60 min'},
        {t:'Fix one small bug or add one small feature.',s:'Even a documentation fix counts.',time:'60 min'},
        {t:'Submit a pull request.',s:'',time:'20 min'},
        {t:'Write about your contribution on LinkedIn in English.',s:'',time:'15 min'},
      ]},
      {label:'Week 44 — Mock interviews',skill:'interview',tasks:[
        {t:'Do 2 full mock technical interviews on Pramp or Interviewing.io.',s:'Free. Real interviewers. Do not skip.',time:'60 min each'},
        {t:'After each mock: write down every question you struggled with.',s:'',time:'20 min'},
        {t:'Re-study every weak area identified.',s:'',time:'45 min'},
        {t:'Practice behavioral answers until they feel natural in English.',s:'',time:'20 min'},
        {t:'Research 10 companies you want to apply to. Understand their tech stack.',s:'',time:'30 min'},
      ]},
    ],
    win:'100 Leetcode problems solved. First open source contribution. Mock interviews done.',
    rule:RULE,
  },
  {
    id:'m12',badge:'Month 12',title:'Year 1 complete — honest self-assessment',
    color:'#FBEAF0',txt:'#72243E',prog:'#993556',skills:['interview','english','projects'],
    weeks:[
      {label:'Week 45–46 — Consolidation',skill:'dsa',tasks:[
        {t:'Re-solve your 10 hardest Leetcode problems without looking at solutions.',s:'',time:'60 min'},
        {t:'Write a cheat sheet of every pattern you know: sliding window, two pointer, BFS etc.',s:'',time:'30 min'},
        {t:'Identify your 3 weakest DSA topics. Make a plan to fix them in Year 2.',s:'',time:'20 min'},
        {t:'Review every project you rebuilt. Can you explain every line?',s:'',time:'60 min'},
        {t:'Write down honestly: what can you build from scratch without AI today?',s:'',time:'20 min'},
      ]},
      {label:'Week 47 — Resume + LinkedIn',skill:'interview',tasks:[
        {t:'Rewrite your resume. Only include projects you can fully defend.',s:'Remove or downgrade AI-assisted ones.',time:'45 min'},
        {t:'Add your rebuilt Python projects prominently.',s:'',time:'20 min'},
        {t:'Update LinkedIn with all contributions, Leetcode progress, projects.',s:'',time:'20 min'},
        {t:'Get one senior developer to review your resume. Act on feedback.',s:'',time:'30 min'},
        {t:'Write your personal pitch in English. 90 seconds. Memorize it.',s:'',time:'20 min'},
      ]},
      {label:'Week 48 — Year 1 review',skill:'english',tasks:[
        {t:'Record a 10-minute video in English: what you learned, what changed, what is next.',s:'No script. Speak freely.',time:'20 min'},
        {t:'Do one final mock interview covering DSA + projects + behavioral.',s:'',time:'60 min'},
        {t:'Write a LinkedIn post about your Year 1 journey. Honest and specific.',s:'',time:'20 min'},
        {t:'Set Year 2 targets: Leetcode Medium count, companies to target, internship applications.',s:'',time:'30 min'},
        {t:'You are no longer starting from zero. You have a foundation.',s:'Year 2 is where you become dangerous.',time:''},
      ]},
    ],
    win:'Year 1 done. 100+ Leetcode. 3 rebuilt projects you own. English usable. Foundation real.',
    rule:'',
  },
];

export const ROADMAP_DATA = addXP(rawMonths);
export const totalTasks = ROADMAP_DATA.reduce((a,m)=>a+m.weeks.reduce((b,w)=>b+w.tasks.length,0),0);
