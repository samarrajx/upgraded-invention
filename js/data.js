// js/data.js — Career OS task data (auto-generated from original roadmap)

export const SKILL_COLORS = {
  python:   { bg:'var(--s-py-bg)', tx:'var(--s-py-tx)', pr:'var(--s-py-pr)' },
  dsa:      { bg:'var(--s-ds-bg)', tx:'var(--s-ds-tx)', pr:'var(--s-ds-pr)' },
  english:  { bg:'var(--s-en-bg)', tx:'var(--s-en-tx)', pr:'var(--s-en-pr)' },
  math:     { bg:'var(--s-ma-bg)', tx:'var(--s-ma-tx)', pr:'var(--s-ma-pr)' },
  projects: { bg:'var(--s-pr-bg)', tx:'var(--s-pr-tx)', pr:'var(--s-pr-pr)' },
  interview:{ bg:'var(--s-in-bg)', tx:'var(--s-in-tx)', pr:'var(--s-in-pr)' },
  system:   { bg:'var(--s-sy-bg)', tx:'var(--s-sy-tx)', pr:'var(--s-sy-pr)' },
};

export const SKILL_LABELS = {
  python: 'Python',
  dsa: 'DSA',
  english: 'English',
  math: 'Math',
  projects: 'Projects',
  interview: 'Interview',
  system: 'System Design'
};

function xp(t){ const n=parseInt(t)||30; return n<=15?5:n<=25?8:n<=35?12:n<=50?15:20; }

function addXP(months){
  return months.map(m=>({...m, weeks: m.weeks.map(w=>({...w, tasks: w.tasks.map(t=>({...t, xp:xp(t.time)}))}))}));
}

export const RULE = 'No AI for code during practice. Write every line yourself.';

export const YEAR_GROUPS = [
  {label:'YEAR 1 — FUNDAMENTALS (2025–2026)',ids:['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12']},
  {label:'YEAR 2 — BECOME DANGEROUS (2026–2027)',ids:['m13','m14','m15','m16','m17','m18','m19','m20','m21','m22','m23','m24']},
  {label:'YEAR 3 — GET THE OFFER (2027–2028)',ids:['m25','m26','m27','m28','m29']},
];

const rawMonths = [
  {id:'m1',badge:'Month 1',title:'Python from scratch + Math foundations',color:'#E6F1FB',txt:'#0C447C',prog:'#185FA5',skills:['python','math','english'],weeks:[
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
      {t:'Use a loop to find the largest number in a list of 5 numbers. No max(). Write the logic yourself.',s:'',time:'45 min'},
      {t:'Print multiplication table of any number user enters.',s:'',time:'30 min'},
      {t:'Count how many numbers in a list are above 50. No COUNTIF. Loop through. Check each. Count.',s:'',time:'30 min'},
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
  ],win:'You can write Python programs from scratch. Math habit started. English habit started.',rule:RULE},

  {id:'m2',badge:'Month 2',title:'Python functions + lists + basic DSA thinking',color:'#FAECE7',txt:'#712B13',prog:'#993C1D',skills:['python','dsa','english','math'],weeks:[
    {label:'Week 5 — Python: functions & lists',skill:'python',tasks:[
      {t:'Learn functions. Write a function that takes two numbers and returns their sum.',s:'def add(a, b): return a + b',time:'30 min'},
      {t:'Write a function that finds the largest number in a list. No max().',s:'Write the logic inside the function.',time:'45 min'},
      {t:'Learn lists: add, remove, access by index, loop through.',s:'',time:'30 min'},
      {t:'Write a function that removes duplicates from a list without using set().',s:'Think how you would do it manually first.',time:'45 min'},
      {t:'Write a function that reverses a list without using .reverse().',s:'',time:'30 min'},
    ]},
    {label:'Week 6 — Python: strings & dictionaries',skill:'python',tasks:[
      {t:'Learn string operations: split, join, upper, lower, strip, replace.',s:'',time:'30 min'},
      {t:'Write a program that counts how many times each word appears in a sentence. No Counter library. Use a dictionary.',s:'',time:'45 min'},
      {t:'Learn dictionaries. Store 5 agent names and their transaction counts.',s:'',time:'30 min'},
      {t:'Write a function that finds the agent with highest transactions from a dictionary.',s:'',time:'30 min'},
      {t:'Write a program that checks if a word is a palindrome.',s:'',time:'30 min'},
    ]},
    {label:'Week 7 — DSA: what it actually is',skill:'dsa',tasks:[
      {t:'Understand what an array/list is in memory. Read, do not code yet.',s:'geeksforgeeks.org/array-data-structure',time:'30 min'},
      {t:'Implement linear search in Python from scratch. No libraries.',s:'Loop through, check each element.',time:'30 min'},
      {t:'Understand time complexity intuitively. Why does 10,000 agents make manual check slow?',s:'',time:'30 min'},
      {t:'Implement binary search. Understand why the list must be sorted first.',s:'',time:'45 min'},
      {t:'Write both searches. Compare how many steps each takes on a list of 100 items.',s:'',time:'30 min'},
    ]},
    {label:'Week 8 — Math + English',skill:'math',tasks:[
      {t:'Khan Academy: intro to algebra. Complete all exercises in the unit.',s:'',time:'45 min'},
      {t:'Learn what a function is in math (y = 2x + 1). Plot 5 points by hand.',s:'',time:'30 min'},
      {t:'English: Speak for 2 minutes in English about what you learned this week. Record it. Do not read from notes.',s:'',time:'15 min'},
      {t:'English: Write a short paragraph explaining linear search in English.',s:'If you can explain it, you understand it.',time:'15 min'},
      {t:'Learn powers and logarithms basics. Why does log matter in DSA?',s:'',time:'30 min'},
    ]},
  ],win:'You can write functions, work with lists and dictionaries, and understand what DSA is.',rule:RULE},

  {id:'m3',badge:'Month 3',title:'DSA seriously begins + Python files',color:'#EEEDFE',txt:'#3C3489',prog:'#534AB7',skills:['python','dsa','english','math'],weeks:[
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
      {t:'Write a program that reads a CSV manually (no pandas) and prints each row. Split by comma.',s:'',time:'45 min'},
      {t:'Write a program that reads agent names + transactions from a file and finds the top performer.',s:'',time:'45 min'},
    ]},
    {label:'Week 11 — Math: functions & graphs',skill:'math',tasks:[
      {t:'Khan Academy: functions unit. Complete all exercises.',s:'',time:'45 min'},
      {t:'Learn slope of a line. Calculate slope between 5 pairs of points.',s:'',time:'30 min'},
      {t:'Understand what O(n) and O(n²) means using graph intuition. Draw both curves.',s:'',time:'30 min'},
      {t:'Learn basic probability. If 3 of 10 agents fail, what is the probability of failure?',s:'',time:'30 min'},
      {t:'Write a Python program that simulates rolling a dice 1000 times and counts each outcome.',s:'',time:'30 min'},
    ]},
    {label:'Week 12 — English push',skill:'english',tasks:[
      {t:'Watch one English movie or show episode with English subtitles. English audio, English subs.',s:'',time:'45 min'},
      {t:'Summarize what you watched in 5 English sentences. Write it down.',s:'',time:'15 min'},
      {t:'Read one full English article from BBC. Understand every sentence.',s:'',time:'20 min'},
      {t:'Speak for 3 minutes in English explaining sorting algorithms. Record yourself.',s:'',time:'15 min'},
      {t:'Write an email in English to an imaginary interviewer introducing yourself.',s:'',time:'20 min'},
    ]},
  ],win:'You can implement 3 sorting algorithms, read/write files, and explain concepts in English.',rule:RULE},

  {id:'m4',badge:'Month 4',title:'Stacks, queues, recursion + rebuild project 1',color:'#E1F5EE',txt:'#085041',prog:'#0F6E56',skills:['python','dsa','projects','english'],weeks:[
    {label:'Week 13 — Stacks & queues',skill:'dsa',tasks:[
      {t:'Understand what a stack is. Implement using a Python list. push = append, pop = pop.',s:'',time:'45 min'},
      {t:'Solve: check if brackets are balanced using a stack.',s:'',time:'45 min'},
      {t:'Understand what a queue is. Implement using a Python list.',s:'',time:'30 min'},
      {t:'Understand when to use stack vs queue. Write examples from real life.',s:'',time:'20 min'},
      {t:'Solve 2 Leetcode Easy problems using stack or queue. No AI.',s:'leetcode.com — filter by Stack, Easy.',time:'45 min'},
    ]},
    {label:'Week 14 — Recursion',skill:'dsa',tasks:[
      {t:'Understand recursion with factorial. Trace the call stack on paper.',s:'Do not code until you can trace it by hand.',time:'30 min'},
      {t:'Implement factorial recursively. Then fibonacci.',s:'',time:'30 min'},
      {t:'Understand the base case. What happens without it? Let it crash. See error.',s:'',time:'20 min'},
      {t:'Solve: reverse a string using recursion.',s:'',time:'30 min'},
      {t:'Solve: power function using recursion. x to the power n.',s:'',time:'30 min'},
    ]},
    {label:'Week 15 — Rebuild project 1',skill:'projects',tasks:[
      {t:'Open your Staff Attendance Manager. Read every file without AI.',s:'Understand what each file does. Take notes.',time:'60 min'},
      {t:'Write down in plain English what the authentication logic does. If you cannot explain it, you do not own it.',s:'',time:'30 min'},
      {t:'Rebuild the user login from scratch in Python. Username + password in a file.',s:'',time:'60 min'},
      {t:'Add a session concept manually: store logged-in user in a variable.',s:'',time:'30 min'},
      {t:'Write a README for this rebuilt version explaining every decision you made.',s:'',time:'30 min'},
    ]},
    {label:'Week 16 — English: technical speaking',skill:'english',tasks:[
      {t:'Explain recursion in English out loud for 2 minutes. Record it.',s:'',time:'15 min'},
      {t:'Read one page of Clean Code book in English. Summarize aloud.',s:'PDF available free online.',time:'20 min'},
      {t:'Practice answering: "Tell me about yourself" in English. 90 seconds. Practice 5 times.',s:'',time:'20 min'},
      {t:'Write a LinkedIn post in English about what you built this month. Publish it.',s:'',time:'20 min'},
      {t:'Find one English-speaking developer on Twitter/X. Read their content daily.',s:'',time:'5 min'},
    ]},
  ],win:'You understand recursion, stacks, queues. You partially own your own project.',rule:RULE},

  {id:'m5',badge:'Month 5',title:'Linked lists + trees + SQL from scratch',color:'#FAEEDA',txt:'#633806',prog:'#854F0B',skills:['dsa','python','math'],weeks:[
    {label:'Week 17 — Linked lists',skill:'dsa',tasks:[
      {t:'Understand what a linked list is. Draw it on paper. Node has value + pointer.',s:'',time:'30 min'},
      {t:'Implement a singly linked list: Node class + LinkedList class. insert, delete, print.',s:'',time:'60 min'},
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
      {t:'Install SQLite (comes with Python). Create a database with agents table.',s:'Write the SQL by hand.',time:'30 min'},
      {t:'INSERT 10 rows. SELECT all. SELECT where transactions > 50.',s:'',time:'30 min'},
      {t:'Write a JOIN between agents table and transactions table.',s:'',time:'45 min'},
      {t:'Write GROUP BY query to find total transactions per agent.',s:'',time:'30 min'},
      {t:'Understand normalization conceptually.',s:'',time:'30 min'},
    ]},
    {label:'Week 20 — Math: statistics',skill:'math',tasks:[
      {t:'Learn variance and standard deviation. Calculate by hand for 5 numbers.',s:'',time:'30 min'},
      {t:'Learn what a normal distribution is intuitively. Khan Academy: statistics.',s:'',time:'30 min'},
      {t:'Learn correlation. Does more training mean more transactions? Measure it.',s:'',time:'30 min'},
      {t:'Write Python: calculate standard deviation without using any library.',s:'',time:'45 min'},
      {t:'Learn basic probability: AND, OR, NOT. Solve 10 problems.',s:'',time:'30 min'},
    ]},
  ],win:'You understand linked lists, trees, and can write real SQL from scratch.',rule:RULE},

  {id:'m6',badge:'Month 6',title:'Leetcode begins + rebuild project 2 + English',color:'#FBEAF0',txt:'#72243E',prog:'#993556',skills:['dsa','projects','english'],weeks:[
    {label:'Week 21–22 — First 25 Leetcode Easy',skill:'dsa',tasks:[
      {t:'Solve Leetcode #1 Two Sum. Think before coding.',s:'',time:'45 min'},
      {t:'Solve Leetcode #9 Palindrome Number.',s:'',time:'30 min'},
      {t:'Solve Leetcode #20 Valid Parentheses using stack.',s:'',time:'30 min'},
      {t:'Solve Leetcode #53 Maximum Subarray.',s:'',time:'45 min'},
      {t:'Solve 21 more Easy problems. Track every one in a notebook. Total: 25.',s:'',time:''},
    ]},
    {label:'Week 23 — Rebuild project 2',skill:'projects',tasks:[
      {t:'Open BC Performance System. Read the commission engine logic.',s:'Understand what each CSV column means.',time:'60 min'},
      {t:'Rebuild the TDS 2% calculation in pure Python. No framework.',s:'',time:'30 min'},
      {t:'Rebuild the CSV parser in Python without any library. Read file, split by comma.',s:'',time:'60 min'},
      {t:'Write unit tests for your TDS calculator. Handle edge cases.',s:'',time:'30 min'},
      {t:'Document every function. Explain the why, not just the what.',s:'',time:'30 min'},
    ]},
    {label:'Week 24 — English interview prep',skill:'english',tasks:[
      {t:'"Tell me about yourself" in English. 2 minutes. Record.',s:'',time:'15 min'},
      {t:'"What is a linked list?" in English without notes.',s:'',time:'10 min'},
      {t:'"Describe a project you built." Use BC Performance System. Speak slowly.',s:'',time:'15 min'},
      {t:'Write answers to 3 HR questions. Strength, weakness, why this company.',s:'',time:'20 min'},
      {t:'Find a peer for a mock English conversation. Pramp.com is free.',s:'',time:'30 min'},
    ]},
  ],win:'25 Leetcode Easy solved. Two projects partially owned. English interview ready.',rule:RULE},

  {id:'m7',badge:'Month 7',title:'Hashing + heaps + Python OOP',color:'#E6F1FB',txt:'#0C447C',prog:'#185FA5',skills:['dsa','python','english'],weeks:[
    {label:'Week 25 — Hashing',skill:'dsa',tasks:[
      {t:'Understand a hash table and why it is O(1) average lookup.',s:'',time:'30 min'},
      {t:'Implement a basic hash map in Python from scratch. No dict.',s:'',time:'60 min'},
      {t:'Solve Leetcode #242 Valid Anagram.',s:'',time:'30 min'},
      {t:'Solve Leetcode #217 Contains Duplicate.',s:'',time:'20 min'},
      {t:'Solve Leetcode #383 Ransom Note.',s:'',time:'20 min'},
    ]},
    {label:'Week 26 — Heaps',skill:'dsa',tasks:[
      {t:'Understand min-heap vs max-heap.',s:'',time:'30 min'},
      {t:'Use Python heapq module to find top 3 agents by transactions.',s:'',time:'30 min'},
      {t:'Understand why heap gives O(log n) insert vs O(n) for sorted list.',s:'',time:'20 min'},
      {t:'Solve Leetcode #703 Kth Largest Element in a Stream.',s:'',time:'45 min'},
      {t:'Solve Leetcode #1046 Last Stone Weight.',s:'',time:'30 min'},
    ]},
    {label:'Week 27 — Python OOP',skill:'python',tasks:[
      {t:'Learn classes. Create a BankAccount class with deposit and withdraw.',s:'',time:'45 min'},
      {t:'Learn inheritance. SavingsAccount extends BankAccount.',s:'',time:'30 min'},
      {t:'Understand encapsulation. Make balance private. Change via methods only.',s:'',time:'30 min'},
      {t:'Rebuild your Agent class from BC System using proper OOP.',s:'',time:'45 min'},
      {t:'Write a simple unittest for your Agent class.',s:'',time:'30 min'},
    ]},
    {label:'Week 28 — English',skill:'english',tasks:[
      {t:'Speak English for 5 minutes every morning. Record daily.',s:'',time:'10 min'},
      {t:'Watch one English developer conference talk on YouTube.',s:'Google I/O, PyCon, etc.',time:'30 min'},
      {t:'Practice explaining OOP in English. Record 3-minute video.',s:'',time:'15 min'},
      {t:'Write a cold email in English to a developer you respect.',s:'Just write it well.',time:'20 min'},
      {t:'Read 2 pages of an English tech book daily.',s:'',time:'15 min'},
    ]},
  ],win:'You understand hashing, heaps, and can write OOP Python properly.',rule:RULE},

  {id:'m8',badge:'Month 8',title:'Graphs + dynamic programming intro',color:'#FAECE7',txt:'#712B13',prog:'#993C1D',skills:['dsa','math','english'],weeks:[
    {label:'Week 29 — Graphs basics',skill:'dsa',tasks:[
      {t:'Understand nodes + edges. Directed vs undirected. Draw 5 real-life examples.',s:'',time:'30 min'},
      {t:'Implement a graph using adjacency list in Python.',s:'',time:'45 min'},
      {t:'Implement BFS on a graph.',s:'',time:'45 min'},
      {t:'Implement DFS on a graph.',s:'',time:'30 min'},
      {t:'Solve Leetcode #200 Number of Islands.',s:'',time:'45 min'},
    ]},
    {label:'Week 30 — Graphs continued',skill:'dsa',tasks:[
      {t:'Solve Leetcode #133 Clone Graph.',s:'',time:'45 min'},
      {t:'Solve Leetcode #207 Course Schedule. Detect cycle.',s:'',time:'60 min'},
      {t:'Understand Dijkstra\'s shortest path algorithm conceptually.',s:'',time:'30 min'},
      {t:'Write out BFS and DFS from memory without notes.',s:'',time:'30 min'},
      {t:'Solve one more graph problem of your choice.',s:'',time:'45 min'},
    ]},
    {label:'Week 31 — Dynamic programming intro',skill:'dsa',tasks:[
      {t:'Memoization: Fibonacci with memo vs without. Compare steps.',s:'',time:'45 min'},
      {t:'Bottom-up DP: Fibonacci iteratively with a table.',s:'',time:'30 min'},
      {t:'Solve Leetcode #70 Climbing Stairs using DP.',s:'',time:'30 min'},
      {t:'Solve Leetcode #198 House Robber.',s:'',time:'45 min'},
      {t:'Write the DP table for each problem by hand.',s:'If you cannot, you do not understand it.',time:''},
    ]},
    {label:'Week 32 — Math for interviews',skill:'math',tasks:[
      {t:'Learn modular arithmetic.',s:'',time:'30 min'},
      {t:'Learn bit manipulation basics: AND, OR, XOR, shifts.',s:'',time:'30 min'},
      {t:'Solve Leetcode #191 Number of 1 Bits.',s:'',time:'20 min'},
      {t:'Learn combinatorics: permutations and combinations.',s:'',time:'30 min'},
      {t:'English: Explain dynamic programming out loud for 2 minutes.',s:'',time:'15 min'},
    ]},
  ],win:'You can solve graph problems and understand DP.',rule:RULE},

  {id:'m9',badge:'Month 9',title:'50 Leetcode Easy done + rebuild project 3',color:'#EEEDFE',txt:'#3C3489',prog:'#534AB7',skills:['dsa','projects','english'],weeks:[
    {label:'Week 33–34 — Leetcode sprint to 50',skill:'dsa',tasks:[
      {t:'Solve 10 new Easy problems. Any topic. Track every problem.',s:'',time:'60 min/day'},
      {t:'Write your thought process in English before coding each one.',s:'',time:'15 min/problem'},
      {t:'Re-solve problems you struggled with. From memory.',s:'',time:'30 min'},
      {t:'Time yourself. Aim for Easy problems in under 20 minutes.',s:'',time:''},
      {t:'Milestone: 50 Leetcode Easy done.',s:'',time:''},
    ]},
    {label:'Week 35 — Rebuild BC System core',skill:'projects',tasks:[
      {t:'Rebuild the agent data model in Python using OOP.',s:'',time:'60 min'},
      {t:'Rebuild the commission calculation logic in pure Python. No framework.',s:'',time:'60 min'},
      {t:'Write a CSV importer: read agent data, create Agent objects.',s:'',time:'45 min'},
      {t:'Write unit tests for commission calculation.',s:'',time:'30 min'},
      {t:'Push Python version to GitHub with your own README.',s:'',time:'20 min'},
    ]},
    {label:'Week 36 — Communication + GitHub',skill:'english',tasks:[
      {t:'Record a 5-minute video explaining your rebuilt BC system in English.',s:'',time:'30 min'},
      {t:'Write a detailed GitHub README in English. Problem, solution, what you learned.',s:'',time:'30 min'},
      {t:'Answer mock interview questions on video: DSA + project + behavioral.',s:'',time:'30 min'},
      {t:'Post a LinkedIn update about completing 50 Leetcode problems.',s:'',time:'15 min'},
      {t:'Read your README aloud. Does it sound professional?',s:'',time:'15 min'},
    ]},
  ],win:'50 Leetcode Easy done. BC System rebuilt in Python. You own it now.',rule:RULE},

  {id:'m10',badge:'Month 10',title:'Leetcode Medium begins + system design intro',color:'#E1F5EE',txt:'#085041',prog:'#0F6E56',skills:['dsa','system','english'],weeks:[
    {label:'Week 37–38 — Leetcode Medium: sliding window & two pointers',skill:'dsa',tasks:[
      {t:'Learn sliding window. Solve #3 Longest Substring Without Repeating.',s:'',time:'60 min'},
      {t:'Solve #424 Longest Repeating Character Replacement.',s:'',time:'45 min'},
      {t:'Learn two pointer. Solve #167 Two Sum II.',s:'',time:'30 min'},
      {t:'Solve #15 Three Sum.',s:'',time:'60 min'},
      {t:'Solve #11 Container With Most Water.',s:'',time:'45 min'},
    ]},
    {label:'Week 39 — System design basics',skill:'system',tasks:[
      {t:'What happens when you type google.com? Every step.',s:'',time:'30 min'},
      {t:'Learn what a database index is. Why it speeds up queries.',s:'',time:'30 min'},
      {t:'Learn what caching is. Redis concept.',s:'',time:'30 min'},
      {t:'Learn what a REST API is from first principles.',s:'',time:'30 min'},
      {t:'Draw your BC System architecture from memory. Label every component.',s:'',time:'30 min'},
    ]},
    {label:'Week 40 — English: technical interview',skill:'english',tasks:[
      {t:'Do a full mock interview on Pramp.com in English.',s:'',time:'60 min'},
      {t:'Practice explaining a Medium Leetcode solution in English clearly.',s:'',time:'20 min'},
      {t:'Write answers to 10 behavioral questions in STAR format.',s:'',time:'30 min'},
      {t:'Read answers aloud until they sound natural.',s:'',time:'20 min'},
      {t:'Record a mock system design explanation for your BC System.',s:'',time:'20 min'},
    ]},
  ],win:'You can solve Leetcode Medium problems. System design basics understood.',rule:''},

  {id:'m11',badge:'Month 11',title:'100 Leetcode + open source contribution',color:'#FAEEDA',txt:'#633806',prog:'#854F0B',skills:['dsa','projects','interview'],weeks:[
    {label:'Week 41–42 — Leetcode Medium sprint',skill:'dsa',tasks:[
      {t:'Solve 10 more Medium problems. Focus on binary search and trees.',s:'',time:'60 min/day'},
      {t:'Solve #98 Validate Binary Search Tree.',s:'',time:'45 min'},
      {t:'Solve #102 Binary Tree Level Order Traversal.',s:'',time:'45 min'},
      {t:'Solve #33 Search in Rotated Sorted Array.',s:'',time:'45 min'},
      {t:'Milestone: 100 Leetcode problems.',s:'',time:''},
    ]},
    {label:'Week 43 — Open source',skill:'projects',tasks:[
      {t:'Find a small Python/JS project with "good first issue" label.',s:'',time:'30 min'},
      {t:'Read the codebase. Understand it without AI.',s:'',time:'60 min'},
      {t:'Fix one small bug or add one small feature.',s:'',time:'60 min'},
      {t:'Submit a pull request.',s:'',time:'20 min'},
      {t:'Write about your contribution on LinkedIn in English.',s:'',time:'15 min'},
    ]},
    {label:'Week 44 — Mock interviews',skill:'interview',tasks:[
      {t:'Do 2 full mock technical interviews on Pramp or Interviewing.io.',s:'',time:'60 min each'},
      {t:'Write down every question you struggled with.',s:'',time:'20 min'},
      {t:'Re-study every weak area identified.',s:'',time:'45 min'},
      {t:'Research 10 companies you want to apply to. Understand their stack.',s:'',time:'30 min'},
      {t:'Practice behavioral answers until natural in English.',s:'',time:'20 min'},
    ]},
  ],win:'100 Leetcode problems. First open source contribution.',rule:''},

  {id:'m12',badge:'Month 12',title:'Year 1 complete — honest self-assessment',color:'#FBEAF0',txt:'#72243E',prog:'#993556',skills:['interview','english','projects'],weeks:[
    {label:'Week 45–46 — Consolidation',skill:'dsa',tasks:[
      {t:'Re-solve your 10 hardest Leetcode problems without looking at solutions.',s:'',time:'60 min'},
      {t:'Write a cheat sheet of every DSA pattern you know.',s:'',time:'30 min'},
      {t:'Identify your 3 weakest topics. Plan for Year 2.',s:'',time:'20 min'},
      {t:'Review every project you rebuilt. Can you explain every line?',s:'',time:'60 min'},
      {t:'Write honestly: what can you build from scratch without AI today?',s:'',time:'20 min'},
    ]},
    {label:'Week 47 — Resume + LinkedIn',skill:'interview',tasks:[
      {t:'Rewrite your resume. Only include projects you can defend.',s:'',time:'45 min'},
      {t:'Add rebuilt Python projects prominently.',s:'',time:'20 min'},
      {t:'Update LinkedIn with contributions, Leetcode, projects.',s:'',time:'20 min'},
      {t:'Get a senior developer to review your resume.',s:'',time:'30 min'},
      {t:'Write your personal pitch in English. 90 seconds.',s:'',time:'20 min'},
    ]},
    {label:'Week 48 — Year 1 review',skill:'english',tasks:[
      {t:'Record 10-minute video in English: what you learned, what is next.',s:'',time:'20 min'},
      {t:'Do one final mock interview covering DSA + projects + behavioral.',s:'',time:'60 min'},
      {t:'Write a LinkedIn post about your Year 1 journey.',s:'',time:'20 min'},
      {t:'Set Year 2 targets.',s:'',time:'30 min'},
      {t:'You have a foundation now.',s:'',time:''},
    ]},
  ],win:'Year 1 done. 100+ Leetcode. 3 rebuilt projects you own.',rule:''},

  {id:'m13',badge:'Month 13',title:'Leetcode Medium depth + tries + intervals',color:'#FAECE7',txt:'#712B13',prog:'#993C1D',skills:['dsa','english'],weeks:[
    {label:'Week 1 — Tries',skill:'dsa',tasks:[
      {t:'Understand what a Trie is. Draw one for: cat, car, card.',s:'',time:'30 min'},
      {t:'Implement a Trie: insert, search, startsWith. No libraries.',s:'',time:'60 min'},
      {t:'Solve Leetcode #208 Implement Trie.',s:'',time:'45 min'},
      {t:'Solve Leetcode #211 Design Add and Search Words.',s:'',time:'45 min'},
      {t:'Solve Leetcode #212 Word Search II.',s:'',time:'60 min'},
    ]},
    {label:'Week 2 — Intervals',skill:'dsa',tasks:[
      {t:'Understand merge intervals. Draw pattern on paper.',s:'',time:'30 min'},
      {t:'Solve Leetcode #56 Merge Intervals.',s:'',time:'45 min'},
      {t:'Solve Leetcode #57 Insert Interval.',s:'',time:'45 min'},
      {t:'Solve Leetcode #252 Meeting Rooms.',s:'',time:'30 min'},
      {t:'Solve Leetcode #253 Meeting Rooms II.',s:'',time:'45 min'},
    ]},
    {label:'Week 3 — DP patterns',skill:'dsa',tasks:[
      {t:'Solve Leetcode #322 Coin Change. Trace the table.',s:'',time:'60 min'},
      {t:'Solve Leetcode #139 Word Break.',s:'',time:'45 min'},
      {t:'Solve Leetcode #300 Longest Increasing Subsequence.',s:'',time:'45 min'},
      {t:'Solve Leetcode #1143 Longest Common Subsequence.',s:'',time:'45 min'},
      {t:'Write the DP table by hand for each.',s:'',time:'20 min each'},
    ]},
    {label:'Week 4 — English daily output',skill:'english',tasks:[
      {t:'Speak English for 10 minutes every morning. No prep.',s:'',time:'10 min'},
      {t:'Write a technical blog post in English. Publish on dev.to.',s:'',time:'45 min'},
      {t:'Do one mock interview on Pramp entirely in English.',s:'',time:'60 min'},
      {t:'Watch one English show episode without subtitles.',s:'',time:'30 min'},
      {t:'Record yourself explaining Trie in English for 3 minutes.',s:'',time:'15 min'},
    ]},
  ],win:'You know tries, intervals, 4 DP patterns. 120+ Leetcode total.',rule:''},

  {id:'m14',badge:'Month 14',title:'System design fundamentals',color:'#EEEDFE',txt:'#3C3489',prog:'#534AB7',skills:['system','dsa','english'],weeks:[
    {label:'Week 1 — How the internet works',skill:'system',tasks:[
      {t:'Understand DNS request lifecycle.',s:'',time:'30 min'},
      {t:'Understand TCP vs UDP. When to use each.',s:'',time:'30 min'},
      {t:'Understand HTTP vs HTTPS. What TLS actually do.',s:'',time:'30 min'},
      {t:'Understand what a load balancer does.',s:'',time:'30 min'},
      {t:'Draw request lifecycle of your BC System.',s:'',time:'30 min'},
    ]},
    {label:'Week 2 — Databases at scale',skill:'system',tasks:[
      {t:'Vertical vs horizontal scaling.',s:'',time:'30 min'},
      {t:'Database indexing deeply. B-tree index.',s:'',time:'45 min'},
      {t:'Sharding and replication concepts.',s:'',time:'30 min'},
      {t:'CAP theorem at conceptual level.',s:'',time:'30 min'},
      {t:'SQL vs NoSQL. When to choose what.',s:'',time:'30 min'},
    ]},
    {label:'Week 3 — Caching & queues',skill:'system',tasks:[
      {t:'Redis and when to use a cache.',s:'',time:'30 min'},
      {t:'Cache eviction policies: LRU, LFU.',s:'',time:'30 min'},
      {t:'Solve Leetcode #146 LRU Cache from scratch.',s:'',time:'60 min'},
      {t:'Message queues and Kafka concept.',s:'',time:'30 min'},
      {t:'Async processing vs synchronous.',s:'',time:'20 min'},
    ]},
    {label:'Week 4 — Design a real system',skill:'system',tasks:[
      {t:'Design a URL shortener.',s:'',time:'60 min'},
      {t:'Design a notification system.',s:'',time:'45 min'},
      {t:'Read Grokking System Design ch 1–3.',s:'',time:'45 min'},
      {t:'Explain URL shortener design out loud.',s:'',time:'15 min'},
      {t:'Watch one system design video. Take notes.',s:'',time:'30 min'},
    ]},
  ],win:'You can discuss system design in an interview.',rule:''},

  {id:'m15',badge:'Month 15',title:'Advanced graphs + DP + 150 Leetcode',color:'#E1F5EE',txt:'#085041',prog:'#0F6E56',skills:['dsa','english'],weeks:[
    {label:'Week 1 — Advanced graphs',skill:'dsa',tasks:[
      {t:'Topological sort. DFS and Kahn\'s.',s:'',time:'60 min'},
      {t:'Solve Leetcode #207 and #210 Course Schedule I & II.',s:'',time:'45 min each'},
      {t:'Implement Dijkstra\'s fully.',s:'',time:'60 min'},
      {t:'Solve Leetcode #743 Network Delay Time.',s:'',time:'45 min'},
    ]},
    {label:'Week 2 — Advanced DP',skill:'dsa',tasks:[
      {t:'2D DP. Solve Leetcode #62 Unique Paths.',s:'',time:'45 min'},
      {t:'Solve Leetcode #64 Minimum Path Sum.',s:'',time:'30 min'},
      {t:'Solve Leetcode #72 Edit Distance.',s:'',time:'60 min'},
      {t:'Solve Leetcode #312 Burst Balloons.',s:'',time:'60 min'},
    ]},
    {label:'Week 3 — Sprint to 150',skill:'dsa',tasks:[
      {t:'Solve 10 mixed Medium problems.',s:'',time:''},
      {t:'Focus on weakest categories identified.',s:'',time:'60 min/day'},
      {t:'Milestone: 150 Leetcode problems.',s:'',time:''},
      {t:'Update pattern sheet.',s:'',time:'30 min'},
    ]},
    {label:'Week 4 — Communication',skill:'english',tasks:[
      {t:'Do 2 mock interviews in English.',s:'',time:'60 min each'},
      {t:'Write second technical blog post in English.',s:'',time:'45 min'},
      {t:'Speak English for 15 min every morning.',s:'',time:'15 min'},
      {t:'Watch English developer podcast.',s:'',time:'30 min'},
    ]},
  ],win:'150 Leetcode. Advanced patterns comfortable.',rule:''},

  {id:'m16',badge:'Month 16',title:'Backend from scratch — own your stack',color:'#FAEEDA',txt:'#633806',prog:'#854F0B',skills:['python','projects','system'],weeks:[
    {label:'Week 1 — HTTP & APIs from scratch',skill:'python',tasks:[
      {t:'HTTP raw level understanding: method, headers, body.',s:'',time:'30 min'},
      {t:'Build simple HTTP server in Python using only sockets.',s:'',time:'60 min'},
      {t:'Add routing and POST handler for JSON.',s:'',time:'45 min each'},
      {t:'Rebuild in Flask. Understand what it abstracts.',s:'',time:'30 min'},
    ]},
    {label:'Week 2 — Database layer from scratch',skill:'python',tasks:[
      {t:'Build SQLite database layer without ORM. Raw SQL.',s:'',time:'45 min'},
      {t:'Add CRUD operations for agents.',s:'',time:'45 min'},
      {t:'Write 10 integration tests.',s:'',time:'30 min'},
      {t:'Add error handling for edge cases.',s:'',time:'30 min'},
    ]},
    {label:'Week 3 — Auth from scratch',skill:'python',tasks:[
      {t:'Implement registration with hashed passwords (SHA-256).',s:'',time:'45 min'},
      {t:'Implement login and session tokens.',s:'',time:'45 min'},
      {t:'Understand and build a simple JWT manually.',s:'',time:'60 min'},
      {t:'Add auth middleware.',s:'',time:'30 min'},
    ]},
    {label:'Week 4 — Rebuild BC System backend',skill:'projects',tasks:[
      {t:'Rebuild BC Performance System backend: Flask + SQLite.',s:'',time:'90 min'},
      {t:'Implement agent CRUD, commissions, CSV import.',s:'',time:'90 min'},
      {t:'Write 20 tests. Deploy on Render.',s:'',time:'45 min'},
      {t:'Push to GitHub with defense README.',s:'',time:'30 min'},
    ]},
  ],win:'Backend built from scratch. You own the code.',rule:''},

  {id:'m17',badge:'Month 17',title:'Internship applications + mock marathon',color:'#FBEAF0',txt:'#72243E',prog:'#993556',skills:['interview','english','dsa'],weeks:[
    {label:'Week 1 — Application prep',skill:'interview',tasks:[
      {t:'Resume rewrite. Cover letter template.',s:'',time:'45 min each'},
      {t:'Research 20 target companies. Shortlist 5.',s:'',time:'45 min'},
      {t:'Send 5 cold emails asking for referral.',s:'',time:'30 min'},
    ]},
    {label:'Week 2 — Mock marathon',skill:'interview',tasks:[
      {t:'Do 4 mock interviews. Grade yourself.',s:'',time:'60 min each'},
      {t:'Study questions you stumbled on.',s:'',time:'30 min/q'},
      {t:'Practice project explanation (3 min).',s:'',time:'20 min'},
      {t:'One full system design mock.',s:'',time:'45 min'},
    ]},
    {label:'Week 3 — Apply',skill:'interview',tasks:[
      {t:'Submit 5 targeted applications.',s:'',time:'30 min each'},
      {t:'Follow up after 5 days.',s:'',time:'15 min'},
      {t:'Apply to 3 remote roles on Wellfound.',s:'',time:'30 min each'},
      {t:'Track everything.',s:'',time:'10 min'},
    ]},
    {label:'Week 4 — Review',skill:'dsa',tasks:[
      {t:'Solve 5 new Medium problems.',s:'',time:''},
      {t:'Design rate limiter.',s:'',time:'45 min'},
      {t:'Revisit pattern sheet.',s:'',time:'20 min'},
    ]},
  ],win:'Applications sent. System design interview-ready.',rule:''},

  {id:'m18',badge:'Month 18',title:'Year 2 mid-point — honest check',color:'#E6F1FB',txt:'#0C447C',prog:'#185FA5',skills:['dsa','projects','english','interview'],weeks:[
    {label:'Week 1 — DSA self-test',skill:'dsa',tasks:[
      {t:'Solve 5 random Mediums in 2 hours. Interview conditions.',s:'',time:'2 hrs'},
      {t:'Solve one Hard problem attempt.',s:'',time:'60 min'},
      {t:'Identify gaps and plan to fix them.',s:'',time:'20 min each'},
    ]},
    {label:'Week 2 — Project ownership test',skill:'projects',tasks:[
      {t:'Explain Flask backend file by file.',s:'',time:'30 min'},
      {t:'Explain auth logic in English (3 min).',s:'',time:'15 min'},
      {t:'"How would you scale to 10,000 agents?"',s:'',time:'20 min'},
      {t:'Record 30 min project defense video.',s:'',time:'30 min'},
    ]},
    {label:'Week 3 — English milestone',skill:'english',tasks:[
      {t:'30 min English conversation (no Hindi).',s:'',time:'30 min'},
      {t:'Write 500-word essay: why FinTech? (no AI).',s:'',time:'30 min'},
      {t:'One full English mock interview.',s:'',time:'60 min'},
    ]},
    {label:'Week 4 — Adjustment',skill:'interview',tasks:[
      {t:'Review tracker. What happened?',s:'',time:'20 min'},
      {t:'Update resume based on real feedback.',s:'',time:'30 min'},
      {t:'Send 5 more applications.',s:'',time:''},
    ]},
  ],win:'Mid-point reached. Plan adjusted based on reality.',rule:''},

  {id:'m19',badge:'Month 19',title:'200 Leetcode + real open source contribution',color:'#FAECE7',txt:'#712B13',prog:'#993C1D',skills:['dsa','projects','english'],weeks:[
    {label:'Week 1–2 — Sprint to 200',skill:'dsa',tasks:[
      {t:'Solve 25 problems this fortnight.',s:'',time:'2 hrs/day'},
      {t:'Milestone: 200 Leetcode.',s:'',time:''},
      {t:'Re-solve Month 13 problems for speed.',s:'',time:''},
    ]},
    {label:'Week 3 — Real OS contribution',skill:'projects',tasks:[
      {t:'Find active project. Read codebase.',s:'',time:'30 min + 90 min'},
      {t:'Fix real bug/feature. Not docs.',s:'',time:'90 min'},
      {t:'Submit PR. Respond to feedback.',s:'',time:''},
      {t:'Get merged and add to resume.',s:'',time:''},
    ]},
    {label:'Week 4 — Writing',skill:'english',tasks:[
      {t:'Write 3 technical blog posts.',s:'',time:''},
      {t:'Email maintainer with technical question.',s:'',time:'20 min'},
      {t:'Whiteboard communication practice.',s:'',time:'30 min'},
    ]},
  ],win:'200 Leetcode. Merged PR. 3 blogs published.',rule:''},

  {id:'m20',badge:'Month 20',title:'System design advanced',color:'#EEEDFE',txt:'#3C3489',prog:'#534AB7',skills:['system','projects','english'],weeks:[
    {label:'Week 1 — Design at scale',skill:'system',tasks:[
      {t:'Design Twitter/X timeline.',s:'',time:'60 min'},
      {t:'Design payment system (idempotency, retries).',s:'',time:'60 min'},
      {t:'Design fraud detection for BC System.',s:'',time:'45 min'},
      {t:'Consistent hashing and EDA concepts.',s:'',time:'30 min each'},
    ]},
    {label:'Week 2 — BC Scalability',skill:'projects',tasks:[
      {t:'Redesign BC System for 100,000 agents.',s:'',time:'60 min'},
      {t:'Add caching and job queue design.',s:'',time:'30 min each'},
      {t:'Present design in English (8 min).',s:'',time:'20 min'},
    ]},
    {label:'Week 3 — Docker',skill:'system',tasks:[
      {t:'Microservices vs Monolith.',s:'',time:'30 min'},
      {t:'Run Flask app in Docker.',s:'',time:'45 min'},
      {t:'Understand K8s at high level.',s:'',time:'20 min'},
    ]},
    {label:'Week 4 — Push',skill:'english',tasks:[
      {t:'Mock system design interview (45 min).',s:'',time:'45 min'},
      {t:'Send 10 applications.',s:'',time:''},
      {t:'Connect with 5 engineers on LinkedIn.',s:'',time:'20 min'},
    ]},
  ],win:'Can design production systems. Docker running.',rule:''},

  {id:'m21',badge:'Month 21',title:'Company prep + Leetcode Hard',color:'#E1F5EE',txt:'#085041',prog:'#0F6E56',skills:['dsa','interview','english'],weeks:[
    {label:'Week 1 — Leetcode Hard',skill:'dsa',tasks:[
      {t:'Solve #23, #297, #124.',s:'',time:''},
      {t:'Identify pattern for each.',s:'',time:'15 min each'},
      {t:'Attempt 2 more Hards.',s:'',time:'60 min each'},
    ]},
    {label:'Week 2 — Research',skill:'interview',tasks:[
      {t:'Pick top 3 companies. Research interview format.',s:'',time:'60 min each'},
      {t:'Solve 10 tagged problems per company.',s:'',time:''},
      {t:'Preparation checklist per company.',s:'',time:'20 min'},
    ]},
    {label:'Week 3 — Behavioral',skill:'interview',tasks:[
      {t:'Write STAR answers for 4 key scenarios.',s:'',time:'30 min each'},
      {t:'Align with company values.',s:'',time:''},
      {t:'Mock behavioral interview.',s:'',time:'45 min'},
    ]},
    {label:'Week 4 — Fluency',skill:'english',tasks:[
      {t:'20 min technical conversation peer mock.',s:'',time:'20 min'},
      {t:'LinkedIn post about PR.',s:'',time:'15 min'},
      {t:'Rate yourself for 45 min interview.',s:'',time:'10 min'},
    ]},
  ],win:'First Hards solved. Behavioral ready.',rule:''},

  {id:'m22',badge:'Month 22',title:'Interview simulation month',color:'#FAEEDA',txt:'#633806',prog:'#854F0B',skills:['interview','dsa','english'],weeks:[
    {label:'Week 1–2 — Simulations',skill:'interview',tasks:[
      {t:'8 full mock interviews. Grade yourself.',s:'',time:'60 min each'},
      {t:'Fix lowest scoring area before next.',s:'',time:''},
    ]},
    {label:'Week 3 — Weak areas',skill:'dsa',tasks:[
      {t:'Identify 2 weakest topics from mocks.',s:'',time:'20 min'},
      {t:'Solve 10 problems in each.',s:'',time:''},
      {t:'2 more mocks after fix.',s:'',time:'60 min each'},
    ]},
    {label:'Week 4 — Push',skill:'interview',tasks:[
      {t:'Send 15 applications.',s:'',time:''},
      {t:'Apply to 5 remote roles.',s:'',time:''},
      {t:'Update LinkedIn open to work.',s:'',time:'15 min'},
    ]},
  ],win:'8+ mocks done. Weaknesses addressed.',rule:''},

  {id:'m23',badge:'Month 23',title:'Real interviews incoming',color:'#FBEAF0',txt:'#72243E',prog:'#993556',skills:['interview','dsa','english'],weeks:[
    {label:'Week 1 — Routine',skill:'interview',tasks:[
      {t:'Warm-up: 1 Easy + 1 Medium every morning.',s:'',time:'45 min'},
      {t:'Review system design diagrams.',s:'',time:'20 min'},
      {t:'Prepare 5 questions for interviewer.',s:'',time:'20 min'},
    ]},
    {label:'Week 2 — Execution',skill:'interview',tasks:[
      {t:'"Let me think out loud" — practice silence filling.',s:'',time:''},
      {t:'Write down every question after real interview.',s:'',time:'20 min'},
      {t:'Study real interview questions.',s:'',time:''},
    ]},
    {label:'Week 3 — Sharpness',skill:'dsa',tasks:[
      {t:'1 problem/day minimum.',s:'',time:'30 min'},
      {t:'Solve 2 Hard problems.',s:'',time:'60 min each'},
      {t:'Mock interview cold at 8 AM.',s:'',time:'60 min'},
    ]},
    {label:'Week 4 — Negotiation',skill:'english',tasks:[
      {t:'Research market salaries (Levels.fyi).',s:'',time:'30 min'},
      {t:'Negotiation script practice.',s:'',time:'20 min'},
      {t:'Silence strategy after offer.',s:'',time:''},
    ]},
  ],win:'Interviewing for real. Negotiation ready.',rule:''},

  {id:'m24',badge:'Month 24',title:'Year 2 complete — evaluate',color:'#E6F1FB',txt:'#0C447C',prog:'#185FA5',skills:['interview','english','projects'],weeks:[
    {label:'Week 1 — Audit',skill:'interview',tasks:[
      {t:'Review offers and gaps.',s:'',time:'30 min'},
      {t:'Honest English level 1–10.',s:'',time:'10 min'},
      {t:'Speed test: solve Medium < 20 min.',s:'',time:''},
    ]},
    {label:'Week 2 — Planning',skill:'interview',tasks:[
      {t:'Set 3 specific targets for Year 3.',s:'',time:'30 min'},
      {t:'Identify top 10 companies.',s:'',time:'20 min'},
      {t:'Update resume and LinkedIn.',s:'',time:'30 min'},
    ]},
    {label:'Week 3–4 — Reset',skill:'english',tasks:[
      {t:'3 days off DSA.',s:'',time:''},
      {t:'Technical journal entry in English.',s:'',time:'20 min'},
      {t:'Refreshed for the finish line.',s:'',time:''},
    ]},
  ],win:'Audit complete. Year 3 plan set.',rule:''},

  {id:'m25',badge:'Month 25',title:'Year 3 begins — sharpen',color:'#FAECE7',txt:'#712B13',prog:'#993C1D',skills:['dsa','system','english'],weeks:[
    {label:'Week 1 — Hard focus',skill:'dsa',tasks:[
      {t:'3 Hards per week baseline.',s:'',time:'90 min each'},
      {t:'Solve #410, #42, #84.',s:'',time:''},
      {t:'Review Hard patterns.',s:'',time:'20 min'},
    ]},
    {label:'Week 2 — Advanced design',skill:'system',tasks:[
      {t:'Design Google Drive and Chat System.',s:'',time:'60 min each'},
      {t:'Design BC System at 1M agents.',s:'',time:'60 min'},
      {t:'ByteByteGo chapter/week.',s:'',time:'30 min'},
    ]},
    {label:'Week 3–4 — Working language',skill:'english',tasks:[
      {t:'One English conversation/day min.',s:'',time:'20 min'},
      {t:'Technical presentation in English.',s:'',time:''},
      {t:'English news 15 min daily.',s:'',time:'15 min'},
    ]},
  ],win:'Hard problems manageable. System design fluent.',rule:''},

  {id:'m26',badge:'Month 26–28',title:'250 Leetcode + senior design + project',color:'#EEEDFE',txt:'#3C3489',prog:'#534AB7',skills:['dsa','system','projects'],weeks:[
    {label:'DSA peak',skill:'dsa',tasks:[
      {t:'Target: 250 problems total.',s:'',time:''},
      {t:'Time strictly: Easy 10, Medium 25, Hard 45.',s:'',time:''},
      {t:'Company-specific problem sets.',s:'',time:''},
    ]},
    {label:'Senior design',skill:'system',tasks:[
      {t:'SAGA, CQRS, Event Sourcing.',s:'',time:'45 min each'},
      {t:'Design analytics dashboard.',s:'',time:'60 min'},
      {t:'Post-mortem analysis.',s:'',time:'30 min'},
    ]},
    {label:'New Project',skill:'projects',tasks:[
      {t:'Build new project. No AI. No tutorial.',s:'',time:''},
      {t:'Spec first, then ship and share.',s:'',time:''},
      {t:'Project defense practice.',s:'',time:''},
    ]},
  ],win:'250 Leetcode done.',rule:''},

  {id:'m27',badge:'Month 29–30',title:'Final prep — peak condition',color:'#E1F5EE',txt:'#085041',prog:'#0F6E56',skills:['interview','dsa','english'],weeks:[
    {label:'Interview peak',skill:'interview',tasks:[
      {t:'12 mocks in 2 months. Video review.',s:'',time:''},
      {t:'Company-specific answers.',s:'',time:'20 min per company'},
      {t:'Negotiation practice.',s:'',time:'15 min'},
    ]},
    {label:'DSA peak',skill:'dsa',tasks:[
      {t:'3 problems/day mixed.',s:'',time:'90 min'},
      {t:'Timed 90 min assessment.',s:'',time:'90 min'},
      {t:'Pattern speed test (5 min/pattern).',s:'',time:''},
    ]},
    {label:'Communication',skill:'english',tasks:[
      {t:'Small talk practice.',s:'',time:'15 min'},
      {t:'Mock interviewcold at 8 AM.',s:'',time:'60 min'},
      {t:'Watch recording as hiring manager.',s:'',time:''},
    ]},
  ],win:'Peak condition reached.',rule:''},

  {id:'m28',badge:'Month 31–33',title:'Active interview season',color:'#FAEEDA',txt:'#633806',prog:'#854F0B',skills:['interview','english'],weeks:[
    {label:'Volume',skill:'interview',tasks:[
      {t:'50 targeted applications.',s:'',time:''},
      {t:'Prioritize referrals.',s:'',time:''},
      {t:'Pipeline until offer.',s:'',time:''},
    ]},
    {label:'Execution',skill:'interview',tasks:[
      {t:'2 warmup problems before each interview.',s:'',time:'30 min'},
      {t:'Thank-you email in 24 hrs.',s:'',time:'10 min'},
      {t:'Question bank update after each.',s:'',time:'20 min'},
    ]},
    {label:'Persistence',skill:'english',tasks:[
      {t:'5 apps same day as rejection.',s:'',time:''},
      {t:'Ask for feedback data.',s:'',time:''},
      {t:'Pipeline management.',s:'',time:''},
    ]},
  ],win:'Executing pipeline.',rule:''},

  {id:'m29',badge:'Month 34–36',title:'Offer + negotiate + done',color:'#FBEAF0',txt:'#72243E',prog:'#993556',skills:['interview','english'],weeks:[
    {label:'Offer stage',skill:'interview',tasks:[
      {t:'Counter strategy. Competing offers.',s:'',time:''},
      {t:'Team and growth evaluation.',s:'',time:'20 min'},
    ]},
    {label:'Recalibration',skill:'interview',tasks:[
      {t:'Audit if no offer yet.',s:'',time:'30 min'},
      {t:'Consider ₹8–12 LPA door-opener.',s:'',time:''},
    ]},
    {label:'Final reckoning',skill:'english',tasks:[
      {t:'Honest reckoning: for loop to senior design.',s:'',time:'20 min'},
      {t:'Can you defend production systems?',s:'',time:''},
      {t:'Package follows skills.',s:'',time:''},
    ]},
  ],win:'Done.',rule:''},
];

export const ROADMAP_DATA = addXP(rawMonths);
export const totalTasks = ROADMAP_DATA.reduce((a,m)=>a+m.weeks.reduce((b,w)=>b+w.tasks.length,0),0);
