const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../data/db.json');

// In-memory cache
let dbData = null;

// Initial Seed Data Generator
function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const studentPassword = bcrypt.hashSync('Student@123', salt);
  const adminPassword = bcrypt.hashSync('Admin@123', salt);

  return {
    users: [
      {
        id: 'usr_student_01',
        fullName: 'Alex Vance',
        email: 'student@interviewprep.com',
        password: studentPassword,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        college: 'Indian Institute of Technology / Tech University',
        degree: 'B.Tech',
        department: 'Computer Science and Engineering',
        graduationYear: 2027,
        cgpa: '8.8',
        preferredLanguage: 'Python',
        targetCompanies: ['Google', 'Microsoft', 'Amazon', 'TCS Prime'],
        skills: ['Data Structures', 'Python', 'Java', 'React', 'SQL', 'System Design'],
        bio: 'Passionate CS student aiming for Tier-1 Product Companies and SDE roles.',
        isEmailVerified: true,
        xp: 1450,
        level: 4,
        streakDays: 6,
        lastStreakDate: new Date().toISOString().split('T')[0],
        dailyGoalMinutes: 45,
        dailySolvedGoal: 3,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_admin_01',
        fullName: 'Sarah Connor',
        email: 'admin@interviewprep.com',
        password: adminPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
        college: 'Head of Placement Advisory',
        degree: 'M.S. Computer Science',
        department: 'Training & Placements Cell',
        graduationYear: 2020,
        cgpa: '9.4',
        preferredLanguage: 'Java',
        targetCompanies: ['Platform Administration'],
        skills: ['Mentorship', 'Curriculum Design', 'Technical Recruitment'],
        bio: 'Placement Lead and Interview Panelist.',
        isEmailVerified: true,
        xp: 5000,
        level: 10,
        streakDays: 30,
        lastStreakDate: new Date().toISOString().split('T')[0],
        dailyGoalMinutes: 60,
        dailySolvedGoal: 5,
        createdAt: new Date().toISOString()
      }
    ],

    roadmaps: [
  {
    "id": "prog_c",
    "category": "Programming Languages",
    "title": "C Programming",
    "description": "Master procedural programming, memory layout, pointers, structures, and low-level system interaction.",
    "icon": "Code2",
    "color": "from-blue-500 to-cyan-500",
    "topics": [
      {
        "id": "c_basics",
        "title": "Basics & Syntax",
        "subtopics": [
          "Data types & ranges",
          "Variables & operators",
          "Control flow (if-else, switch, loops)",
          "Storage classes (auto, register, static, extern)"
        ],
        "explanation": "C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion, with a static type system.",
        "codeExample": "#include <stdio.h>\n\nint main() {\n    int a = 10, b = 20;\n    printf(\"Sum: %d\\n\", a + b);\n    return 0;\n}",
        "practiceQuestions": [
          {
            "q": "What is the difference between static and global variables?",
            "a": "Global variables have file scope and external linkage by default, whereas static variables declared outside functions have internal linkage (confined to that translation unit)."
          },
          {
            "q": "What happens when integer overflow occurs in signed vs unsigned integers?",
            "a": "Signed integer overflow is undefined behavior in C. Unsigned integer overflow wraps around using modulo arithmetic (2^n)."
          }
        ]
      },
      {
        "id": "c_pointers",
        "title": "Pointers & Dynamic Memory",
        "subtopics": [
          "Pointer arithmetic",
          "Double pointers",
          "Function pointers",
          "malloc, calloc, realloc, free",
          "Memory leak detection"
        ],
        "explanation": "Pointers store memory addresses of variables. Dynamic memory allocation allocates memory on the heap at runtime.",
        "codeExample": "int *ptr = (int *)malloc(5 * sizeof(int));\nif (ptr == NULL) {\n    printf(\"Allocation failed\\n\");\n}\nfree(ptr);",
        "practiceQuestions": [
          {
            "q": "What is a dangling pointer and how to avoid it?",
            "a": "A dangling pointer points to memory that has already been deallocated. Avoid by setting ptr = NULL immediately after free(ptr)."
          },
          {
            "q": "Explain function pointers with a real use case.",
            "a": "Function pointers store addresses of functions, enabling callbacks, event handling, and custom comparator functions like in qsort()."
          }
        ]
      },
      {
        "id": "c_structs",
        "title": "Structures, Unions & File I/O",
        "subtopics": [
          "Struct padding & alignment",
          "Unions vs Structs",
          "Typedef",
          "File streams fopen, fread, fwrite"
        ],
        "explanation": "Structures group different data types under one name. Memory alignment pads structs for efficient CPU word-boundary access.",
        "codeExample": "struct Student {\n    char name[50];\n    int roll;\n    float cgpa;\n};",
        "practiceQuestions": [
          {
            "q": "What is structure padding in C?",
            "a": "Compilers insert empty padding bytes between struct members to align them to natural CPU memory word boundaries (e.g. 4 or 8 bytes)."
          }
        ]
      }
    ]
  },
  {
    "id": "prog_cpp",
    "category": "Programming Languages",
    "title": "C++",
    "description": "Object-oriented programming, STL containers, iterators, templates, and modern C++17/20.",
    "icon": "Cpu",
    "color": "from-blue-600 to-indigo-600",
    "topics": [
      {
        "id": "cpp_oops",
        "title": "Classes, Objects & Virtual Functions",
        "subtopics": [
          "Constructors & Destructors",
          "Deep vs Shallow Copy",
          "Virtual functions & vtable",
          "Abstract classes & pure virtual functions"
        ],
        "explanation": "C++ brings object-oriented paradigms with RAII, virtual tables for runtime polymorphism, and encapsulation.",
        "codeExample": "class Base {\npublic:\n    virtual void show() { cout << \"Base\" << endl; }\n};\nclass Derived : public Base {\npublic:\n    void show() override { cout << \"Derived\" << endl; }\n};",
        "practiceQuestions": [
          {
            "q": "How does vtable and vptr work in C++ dynamic polymorphism?",
            "a": "Each class with virtual functions gets a static vtable (array of function pointers). Each object gets a hidden pointer (_vptr) pointing to its class vtable."
          }
        ]
      },
      {
        "id": "cpp_stl",
        "title": "Standard Template Library (STL)",
        "subtopics": [
          "Vectors, Deque, List",
          "Map, Unordered_map",
          "Set, Priority_queue",
          "STL Algorithms (sort, binary_search, lower_bound)"
        ],
        "explanation": "STL provides powerful template-based data structures and algorithms optimized for peak performance in competitive programming.",
        "codeExample": "#include <vector>\n#include <algorithm>\n\nstd::vector<int> nums = {5, 2, 8, 1};\nstd::sort(nums.begin(), nums.end());",
        "practiceQuestions": [
          {
            "q": "Difference between std::map and std::unordered_map?",
            "a": "std::map uses a Red-Black Tree with O(log N) operations and sorted keys. std::unordered_map uses a hash table with O(1) average lookup and unordered keys."
          }
        ]
      },
      {
        "id": "cpp_modern",
        "title": "Modern C++ (C++11 to C++20)",
        "subtopics": [
          "Smart pointers (unique_ptr, shared_ptr, weak_ptr)",
          "Move semantics & rvalue references",
          "Lambda expressions",
          "auto & constexpr"
        ],
        "explanation": "Modern C++ eliminates raw pointer ownership bugs using RAII smart pointers and achieves zero-cost transfers with move semantics.",
        "codeExample": "auto ptr = std::make_unique<int>(42);\nauto lambda = [](int x, int y) { return x + y; };",
        "practiceQuestions": [
          {
            "q": "Difference between unique_ptr and shared_ptr?",
            "a": "std::unique_ptr has exclusive ownership with zero overhead over raw pointers. std::shared_ptr uses reference counting on a control block for shared ownership."
          }
        ]
      }
    ]
  },
  {
    "id": "prog_java",
    "category": "Programming Languages",
    "title": "Java",
    "description": "JVM architecture, Garbage Collection, Multithreading, Collections Framework, and Java 8 Streams.",
    "icon": "Coffee",
    "color": "from-orange-500 to-red-500",
    "topics": [
      {
        "id": "java_core",
        "title": "JVM Architecture & Memory Areas",
        "subtopics": [
          "ClassLoader",
          "Heap vs Stack",
          "Metaspace",
          "Garbage Collection Algorithms (G1, ZGC)"
        ],
        "explanation": "Java code compiles to bytecode which runs on any Java Virtual Machine. Memory is divided into Heap, Stack, Metaspace, PC Registers, and Native Method Stack.",
        "codeExample": "public class MemoryCheck {\n    public static void main(String[] args) {\n        Runtime rt = Runtime.getRuntime();\n        System.out.println(\"Free memory: \" + rt.freeMemory() / (1024 * 1024) + \"MB\");\n    }\n}",
        "practiceQuestions": [
          {
            "q": "Why is Java platform independent but JVM platform dependent?",
            "a": "Java compiles to standardized platform-neutral bytecode (.class). However, the JVM translating this bytecode into native machine instructions must be built specifically for each host OS."
          }
        ]
      },
      {
        "id": "java_collections",
        "title": "Collections Framework & Streams",
        "subtopics": [
          "HashMap internal working",
          "ArrayList vs LinkedList",
          "ConcurrentHashMap",
          "Stream API & Lambdas"
        ],
        "explanation": "Collections framework offers data structure implementations. In Java 8+, HashMap converts collision buckets into Red-Black Trees when bucket size exceeds TREEIFY_THRESHOLD (8).",
        "codeExample": "List<String> names = Arrays.asList(\"Alex\", \"Bob\", \"Alice\");\nnames.stream().filter(n -> n.startsWith(\"A\")).forEach(System.out::println);",
        "practiceQuestions": [
          {
            "q": "Explain internal working of HashMap in Java 8.",
            "a": "Uses an array of Node buckets indexed by (n-1) & hash(key). If collisions exceed 8 nodes and capacity is >= 64, linked lists convert into balanced trees for O(log N) worst-case retrieval."
          }
        ]
      },
      {
        "id": "java_multithreading",
        "title": "Multithreading & Concurrency",
        "subtopics": [
          "Thread lifecycle & Runnable/Callable",
          "Synchronized & Volatile keywords",
          "ReentrantLock & Deadlocks",
          "ExecutorService & ThreadPools"
        ],
        "explanation": "Java provides built-in multithreading. Synchronized ensures mutual exclusion on object monitors, while volatile prevents thread-local caching of variables.",
        "codeExample": "ExecutorService executor = Executors.newFixedThreadPool(4);\nexecutor.submit(() -> System.out.println(\"Async Task Running\"));\nexecutor.shutdown();",
        "practiceQuestions": [
          {
            "q": "Difference between volatile and synchronized in Java?",
            "a": "volatile guarantees variable visibility across CPU caches without locks. synchronized provides both visibility and atomicity (mutual exclusion) for entire code blocks."
          }
        ]
      }
    ]
  },
  {
    "id": "prog_python",
    "category": "Programming Languages",
    "title": "Python",
    "description": "Pythonic idioms, Generators, Decorators, GIL, Memory Management, and OOPs in Python.",
    "icon": "Terminal",
    "color": "from-yellow-500 to-emerald-500",
    "topics": [
      {
        "id": "py_advanced",
        "title": "Decorators, Generators & Context Managers",
        "subtopics": [
          "First-class functions",
          "Function decorators with arguments",
          "yield and generator expressions",
          "with statement & dunder methods"
        ],
        "explanation": "Decorators dynamically wrap functions to alter behavior. Generators produce lazy sequences with yield, conserving memory.",
        "codeExample": "def timer_decorator(func):\n    def wrapper(*args, **kwargs):\n        import time\n        start = time.time()\n        res = func(*args, **kwargs)\n        print(f\"Elapsed: {time.time() - start:.4f}s\")\n        return res\n    return wrapper",
        "practiceQuestions": [
          {
            "q": "What is Python GIL (Global Interpreter Lock)?",
            "a": "A mutex that protects Python objects, preventing multiple native threads from executing Python bytecodes simultaneously in CPython."
          }
        ]
      },
      {
        "id": "py_memory_oops",
        "title": "Python Memory Model & OOPs",
        "subtopics": [
          "Reference counting & Cyclic Garbage Collector",
          "__init__ vs __new__",
          "Multiple inheritance & MRO (C3 Linearization)",
          "List vs Tuple internal allocation"
        ],
        "explanation": "Python manages memory via reference counting supplemented by a cyclic generational garbage collector.",
        "codeExample": "class Singleton:\n    _instance = None\n    def __new__(cls):\n        if not cls._instance:\n            cls._instance = super().__new__(cls)\n        return cls._instance",
        "practiceQuestions": [
          {
            "q": "How does Method Resolution Order (MRO) work in Python?",
            "a": "Python uses the C3 Linearization algorithm to determine the order in which base classes are searched when calling a method on an instance."
          }
        ]
      }
    ]
  },
  {
    "id": "cs_dsa",
    "category": "Core Computer Science",
    "title": "DSA",
    "description": "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, Greedy, and Sorting.",
    "icon": "Binary",
    "color": "from-purple-500 to-pink-500",
    "topics": [
      {
        "id": "dsa_arrays_strings",
        "title": "Arrays, Two Pointers & Sliding Window",
        "subtopics": [
          "Prefix sums",
          "Two pointers technique",
          "Sliding window maximum/minimum",
          "Dutch national flag algorithm"
        ],
        "explanation": "Arrays offer contiguous memory and O(1) index access. Sliding window reduces O(N^2) subarray problems to linear O(N).",
        "codeExample": "def max_sub_array_len(nums, k):\n    left = total = max_len = 0\n    for right, val in enumerate(nums):\n        total += val\n        while total > k:\n            total -= nums[left]\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len",
        "practiceQuestions": [
          {
            "q": "How does Kadane's algorithm find maximum subarray sum in O(N)?",
            "a": "Maintains current_sum = max(x, current_sum + x) and max_sum = max(max_sum, current_sum)."
          }
        ]
      },
      {
        "id": "dsa_trees_graphs",
        "title": "Binary Trees, BST, DFS, BFS & Shortest Paths",
        "subtopics": [
          "Inorder, Preorder, Postorder traversals",
          "Lowest Common Ancestor (LCA)",
          "Dijkstra and Bellman-Ford algorithms",
          "Topological Sort (Kahn's algorithm)"
        ],
        "explanation": "Trees are hierarchical acyclic graphs. Graph traversals (DFS/BFS) form the backbone of pathfinding, cycle detection, and connectivity.",
        "codeExample": "from collections import deque\ndef bfs(graph, start):\n    visited, queue = {start}, deque([start])\n    while queue:\n        u = queue.popleft()\n        for v in graph[u]:\n            if v not in visited:\n                visited.add(v)\n                queue.append(v)",
        "practiceQuestions": [
          {
            "q": "When should you use Bellman-Ford over Dijkstra?",
            "a": "Dijkstra fails on graphs with negative edge weights. Bellman-Ford handles negative weights and detects negative weight cycles in O(V * E)."
          }
        ]
      },
      {
        "id": "dsa_dp",
        "title": "Dynamic Programming & Memoization",
        "subtopics": [
          "Memoization (Top-down) vs Tabulation (Bottom-up)",
          "0/1 Knapsack & Unbounded Knapsack",
          "Longest Common Subsequence (LCS)",
          "Longest Increasing Subsequence (LIS)"
        ],
        "explanation": "Dynamic Programming solves problems with overlapping subproblems and optimal substructure by caching subproblem solutions.",
        "codeExample": "def lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = 1 + dp[i-1][j-1]\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]",
        "practiceQuestions": [
          {
            "q": "How to optimize LIS from O(N^2) to O(N log N)?",
            "a": "Using patience sorting with binary search (std::lower_bound or bisect) maintaining a tails array of smallest tail values for increasing subsequences."
          }
        ]
      }
    ]
  },
  {
    "id": "cs_dbms",
    "category": "Core Computer Science",
    "title": "DBMS",
    "description": "Relational model, ACID properties, Normalization, Indexing (B-Tree/B+ Tree), Transactions, and Concurrency Control.",
    "icon": "Database",
    "color": "from-cyan-500 to-blue-600",
    "topics": [
      {
        "id": "dbms_acid_norm",
        "title": "ACID Properties, Normalization (1NF to BCNF)",
        "subtopics": [
          "Atomicity, Consistency, Isolation, Durability",
          "Functional dependencies",
          "1NF, 2NF, 3NF, BCNF loss-less decomposition",
          "Transaction isolation levels"
        ],
        "explanation": "ACID ensures reliable database transaction processing even during power failures or concurrent updates.",
        "codeExample": "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;",
        "practiceQuestions": [
          {
            "q": "What are the 4 Transaction Isolation Levels and anomalies they prevent?",
            "a": "Read Uncommitted (allows dirty reads), Read Committed (prevents dirty reads), Repeatable Read (prevents non-repeatable reads), Serializable (prevents phantom reads)."
          }
        ]
      },
      {
        "id": "dbms_indexing",
        "title": "B+ Tree Indexing & Concurrency Protocols",
        "subtopics": [
          "Clustered vs Non-clustered Index",
          "Why B+ Trees over B Trees in databases",
          "Two-Phase Locking (2PL)",
          "Deadlock detection in DBMS"
        ],
        "explanation": "B+ Trees keep all data records in leaf nodes connected by a linked list, making range queries exceptionally fast with minimal disk I/O.",
        "codeExample": "CREATE INDEX idx_user_status_date ON users(status, created_at);",
        "practiceQuestions": [
          {
            "q": "Why do databases prefer B+ Trees over Binary Search Trees or Hash tables for indexing?",
            "a": "B+ Trees have high fan-out (low depth, minimizing disk seek time) and linked leaf nodes for O(range) sequential scanning, which hash tables cannot do."
          }
        ]
      }
    ]
  },
  {
    "id": "cs_os",
    "category": "Core Computer Science",
    "title": "Operating Systems",
    "description": "Process management, Threads, CPU scheduling, Virtual Memory, Paging, Deadlocks, and File Systems.",
    "icon": "Sliders",
    "color": "from-emerald-500 to-teal-600",
    "topics": [
      {
        "id": "os_process_threads",
        "title": "Processes, Threads & Synchronization",
        "subtopics": [
          "Process state diagram",
          "Context switching overhead",
          "Mutex vs Semaphore",
          "Deadlock 4 conditions & Banker's algorithm"
        ],
        "explanation": "A process is a program in execution with its own address space; threads share address space and code while having private registers and stack.",
        "codeExample": "// Deadlock 4 Coffman Conditions:\n// 1. Mutual Exclusion\n// 2. Hold and Wait\n// 3. No Preemption\n// 4. Circular Wait",
        "practiceQuestions": [
          {
            "q": "What is the critical section problem and how does Peterson's solution work?",
            "a": "A region where concurrent processes access shared resources. Peterson's solution uses two flags and a turn variable to satisfy mutual exclusion, progress, and bounded waiting for 2 processes."
          }
        ]
      },
      {
        "id": "os_memory",
        "title": "Virtual Memory, Paging & Page Replacement",
        "subtopics": [
          "Logical to physical address translation (MMU)",
          "Page Table & TLB (Translation Lookaside Buffer)",
          "Page faults & Thrashing",
          "FIFO, LRU, Optimal Page Replacement"
        ],
        "explanation": "Virtual memory separates user logical memory from physical memory, permitting huge programs to run on limited RAM using demand paging.",
        "codeExample": "Physical Address = (Frame Number * Page Size) + Offset",
        "practiceQuestions": [
          {
            "q": "What causes Thrashing in an operating system and how to resolve it?",
            "a": "Thrashing occurs when the system spends more time servicing page faults than executing instructions. Solved by increasing RAM or using Working Set Model / Page Fault Frequency control."
          }
        ]
      }
    ]
  },
  {
    "id": "cs_networks",
    "category": "Core Computer Science",
    "title": "Computer Networks",
    "description": "OSI vs TCP/IP model, TCP 3-way handshake, UDP, DNS, HTTP/HTTPS, Subnetting, Routing protocols.",
    "icon": "Network",
    "color": "from-violet-500 to-purple-700",
    "topics": [
      {
        "id": "net_protocols",
        "title": "Transport Layer: TCP vs UDP & Handshake",
        "subtopics": [
          "TCP 3-way Handshake (SYN, SYN-ACK, ACK)",
          "TCP 4-way Teardown",
          "Flow Control (Sliding Window)",
          "Congestion Control (Slow Start, Congestion Avoidance)"
        ],
        "explanation": "TCP guarantees reliable, ordered, error-checked delivery of packets via acknowledgments and sequence numbers. UDP offers low-latency connectionless datagram streaming.",
        "codeExample": "Client               Server\n  | --- SYN (seq=x) --> |\n  | <-- SYN-ACK (x+1, y)-|\n  | --- ACK (seq=y+1) ->|\nConnection Established!",
        "practiceQuestions": [
          {
            "q": "What happens when you enter a URL in your browser address bar?",
            "a": "1. DNS resolution (browser cache -> OS -> resolver -> root -> TLD -> authoritative). 2. TCP handshake (port 443/80). 3. TLS negotiation for HTTPS. 4. HTTP GET request sent. 5. Server responds. 6. Browser renders HTML/CSS/JS."
          }
        ]
      },
      {
        "id": "net_security",
        "title": "Network Layer, Subnetting & TLS/HTTPS",
        "subtopics": [
          "IPv4 vs IPv6 addressing & CIDR notation",
          "Subnet masks & routing tables",
          "SSL/TLS Handshake & asymmetric/symmetric cryptography",
          "DNS lookup flow"
        ],
        "explanation": "Network security hinges on asymmetric key exchange (RSA/Diffie-Hellman) negotiating a session key for blazing-fast symmetric encryption (AES).",
        "codeExample": "Subnet: 192.168.1.0/24\nNetmask: 255.255.255.0\nTotal Hosts: 2^(32-24) - 2 = 254 usable IPs",
        "practiceQuestions": [
          {
            "q": "Explain how SSL/TLS Handshake establishes a secure HTTPS session.",
            "a": "Client sends ClientHello (supported ciphers). Server responds with ServerHello and Digital Certificate. Client verifies certificate with CA, encrypts pre-master secret using server public key. Both derive symmetric session keys."
          }
        ]
      }
    ]
  },
  {
    "id": "cs_oops",
    "category": "Core Computer Science",
    "title": "OOPs",
    "description": "Object-Oriented Programming principles: Encapsulation, Abstraction, Inheritance, Polymorphism, SOLID principles, and Design Patterns.",
    "icon": "Layers",
    "color": "from-pink-500 to-rose-600",
    "topics": [
      {
        "id": "oops_pillars",
        "title": "The 4 Pillars of OOPs",
        "subtopics": [
          "Encapsulation & Access Modifiers",
          "Abstraction & Interfaces/Abstract Classes",
          "Inheritance types (Single, Multilevel, Multiple)",
          "Polymorphism (Compile-time vs Run-time)"
        ],
        "explanation": "The 4 pillars form the foundation of modular, reusable, extensible, and maintainable software architecture in enterprise engineering.",
        "codeExample": "interface PaymentGateway {\n    void processPayment(double amount);\n}\nclass StripeGateway implements PaymentGateway {\n    public void processPayment(double amount) { /* stripe api */ }\n}",
        "practiceQuestions": [
          {
            "q": "What is the key difference between Abstraction and Encapsulation?",
            "a": "Abstraction focuses on hiding background implementation details and exposing only essential behavior (outer view). Encapsulation binds data and methods together and protects internal state via access modifiers (inner view)."
          },
          {
            "q": "Why does Java not support multiple inheritance with classes?",
            "a": "To avoid the Diamond Problem (ambiguity when two parent classes implement the same method). Java supports multiple inheritance through interfaces."
          }
        ]
      },
      {
        "id": "oops_solid",
        "title": "SOLID Principles & Design Patterns",
        "subtopics": [
          "Single Responsibility Principle (SRP)",
          "Open-Closed Principle (OCP)",
          "Liskov Substitution Principle (LSP)",
          "Interface Segregation (ISP) & Dependency Inversion (DIP)",
          "Singleton, Factory, and Observer patterns"
        ],
        "explanation": "SOLID principles guide developers to design clean, decoupled systems that are easy to test, maintain, and extend without breaking existing behavior.",
        "codeExample": "// Dependency Inversion: Depend upon abstractions, not concretions\nclass OrderService {\n    private final PaymentGateway gateway;\n    public OrderService(PaymentGateway gateway) {\n        this.gateway = gateway;\n    }\n}",
        "practiceQuestions": [
          {
            "q": "Explain Liskov Substitution Principle (LSP) with a classic violation example.",
            "a": "Subtypes must be substitutable for their base types without altering program correctness. Classic violation: Square inheriting from Rectangle where setting width modifies height."
          }
        ]
      }
    ]
  },
  {
    "id": "cs_sql",
    "category": "Core Computer Science",
    "title": "SQL",
    "description": "Advanced SQL queries, Multi-table Joins, Aggregations, Window Functions, Subqueries, CTEs, and Stored Procedures.",
    "icon": "Table",
    "color": "from-teal-500 to-emerald-600",
    "topics": [
      {
        "id": "sql_joins_agg",
        "title": "Multi-Table Joins & Grouped Aggregations",
        "subtopics": [
          "INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF JOIN",
          "GROUP BY & HAVING filters",
          "Aggregate functions (COUNT, SUM, AVG, MIN, MAX)",
          "Handling NULL values with COALESCE/IFNULL"
        ],
        "explanation": "SQL joins connect related records across relational tables based on common keys, while GROUP BY collapses rows into summary metrics.",
        "codeExample": "SELECT d.dept_name, COUNT(e.emp_id) AS total_employees, AVG(e.salary) AS avg_salary\nFROM departments d\nLEFT JOIN employees e ON d.dept_id = e.dept_id\nGROUP BY d.dept_id, d.dept_name\nHAVING COUNT(e.emp_id) >= 3\nORDER BY avg_salary DESC;",
        "practiceQuestions": [
          {
            "q": "What is the execution order of an SQL query?",
            "a": "FROM & JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT / OFFSET."
          }
        ]
      },
      {
        "id": "sql_window_functions",
        "title": "Window Functions & Common Table Expressions (CTEs)",
        "subtopics": [
          "ROW_NUMBER() vs RANK() vs DENSE_RANK()",
          "PARTITION BY & ORDER BY in OVER clause",
          "LEAD() and LAG() for running comparisons",
          "Recursive CTEs (WITH clause)"
        ],
        "explanation": "Window functions perform calculations across a set of table rows related to the current row without collapsing the rows into a single group.",
        "codeExample": "WITH RankedSalaries AS (\n  SELECT emp_name, salary, dept_id,\n         DENSE_RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) as rank\n  FROM employees\n)\nSELECT emp_name, salary, dept_id FROM RankedSalaries WHERE rank = 2;",
        "practiceQuestions": [
          {
            "q": "How to find the N-th highest salary in SQL without window functions vs with window functions?",
            "a": "With window: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER(ORDER BY salary DESC) as rk FROM employees) t WHERE rk = N; Without: SELECT DISTINCT salary FROM employees e1 WHERE N-1 = (SELECT COUNT(DISTINCT salary) FROM employees e2 WHERE e2.salary > e1.salary);"
          }
        ]
      }
    ]
  },
  {
    "id": "prep_aptitude",
    "category": "Aptitude & Reasoning",
    "title": "Aptitude",
    "description": "Quantitative aptitude, arithmetic formulas, rapid mental math, speed, time, work, and probability for placement tests.",
    "icon": "Calculator",
    "color": "from-amber-500 to-orange-600",
    "topics": [
      {
        "id": "apt_arithmetic",
        "title": "Percentages, Profit & Loss, Simple & Compound Interest",
        "subtopics": [
          "Fraction to percentage conversion tricks",
          "Cost Price, Selling Price, Marked Price, Discount",
          "Successive percentage changes",
          "Compound Interest vs Simple Interest difference formula"
        ],
        "explanation": "Arithmetic aptitude tests problem-solving speed and accuracy under strict countdown clocks in campus placement rounds.",
        "codeExample": "Net change for successive changes of a% and b% = (a + b + (a*b)/100)%\nCI - SI for 2 years = P * (R/100)^2",
        "practiceQuestions": [
          {
            "q": "If price of a commodity increases by 25%, by what percent must consumption be reduced to keep expenditure constant?",
            "a": "Reduction% = (r / (100 + r)) * 100 = (25 / 125) * 100 = 20% reduction."
          }
        ]
      },
      {
        "id": "apt_timework_speed",
        "title": "Time & Work, Pipes & Relative Speed",
        "subtopics": [
          "Unit work method (LCM approach)",
          "Efficiency ratios and alternate day work",
          "Pipes and cisterns with inlet/outlet rates",
          "Relative speed for trains crossing poles and each other"
        ],
        "explanation": "Work and speed problems can be solved in seconds using LCM as total work and calculating individual unit efficiencies per hour/day.",
        "codeExample": "Total Work = LCM(days taken by individuals)\nEfficiency = Total Work / Time\nCombined Time = Total Work / (Eff_A + Eff_B)",
        "practiceQuestions": [
          {
            "q": "A can do a piece of work in 10 days, B in 15 days. They work together for 3 days, then A leaves. How long will B take to finish remaining work?",
            "a": "LCM(10, 15) = 30 units. A rate = 3 u/day, B rate = 2 u/day. 3 days combined = 3 * 5 = 15 units done. Remaining = 15 units. B takes 15 / 2 = 7.5 days."
          }
        ]
      }
    ]
  },
  {
    "id": "prep_logical",
    "category": "Aptitude & Reasoning",
    "title": "Logical Reasoning",
    "description": "Syllogisms, Blood Relations, Seating Arrangements, Coding-Decoding, Direction Sense, and Critical Thinking.",
    "icon": "BrainCircuit",
    "color": "from-indigo-500 to-purple-600",
    "topics": [
      {
        "id": "log_deduction",
        "title": "Syllogisms & Deductive Logic",
        "subtopics": [
          "Venn diagram representation",
          "All, Some, No, Some Not rules",
          "Either/Or complementary pairs",
          "Possibility statements in Syllogisms"
        ],
        "explanation": "Syllogisms test formal deductive logic by deriving valid conclusions from given premise statements regardless of real-world facts.",
        "codeExample": "Premise 1: All A are B.\nPremise 2: Some B are C.\nConclusion: Some A are C -> (Does NOT strictly follow, only a possibility).",
        "practiceQuestions": [
          {
            "q": "Statements: All pens are books. All books are markers. Conclusions: I. All pens are markers. II. Some markers are pens.",
            "a": "Both conclusions I and II follow. Since Pen subset of Book subset of Marker, all pens are markers and some markers are pens."
          }
        ]
      },
      {
        "id": "log_relations_arrangements",
        "title": "Blood Relations & Seating Arrangements",
        "subtopics": [
          "Family tree conventions (+ for male, - for female, = for couple)",
          "Coded blood relations (A + B means A is father)",
          "Linear arrangements (facing north/south)",
          "Circular arrangements (facing center/outside)"
        ],
        "explanation": "Seating arrangements test constraint satisfaction and multi-variable deduction, common in Capgemini, TCS, and Infosys exams.",
        "codeExample": "Generation 1: Grandparents\nGeneration 2: Parents, Uncles, Aunts\nGeneration 3: Self, Siblings, Cousins",
        "practiceQuestions": [
          {
            "q": "Pointing to a photograph, a man says, \"She is the daughter of my grandfather's only son.\" Who is she to the man?",
            "a": "Grandfather's only son is the man's father. The daughter of the father is the man's Sister."
          }
        ]
      }
    ]
  },
  {
    "id": "prep_verbal",
    "category": "Aptitude & Reasoning",
    "title": "Verbal Ability",
    "description": "Reading comprehension, Sentence correction, Error spotting, Para jumbles, Synonyms, Antonyms, and Business Communication.",
    "icon": "BookOpen",
    "color": "from-emerald-500 to-cyan-600",
    "topics": [
      {
        "id": "verb_grammar",
        "title": "Sentence Correction & Spotting Errors",
        "subtopics": [
          "Subject-Verb Agreement rules",
          "Modifiers & Dangling Participles",
          "Parallelism in sentence structure",
          "Tense consistency & Preposition collocations"
        ],
        "explanation": "Sentence correction assesses grammatical rigor, syntax precision, and idiomatic correctness essential for corporate communication.",
        "codeExample": "Incorrect: \"Neither the manager nor the employees was present.\"\nCorrect: \"Neither the manager nor the employees WERE present.\" (Verb agrees with the closer subject).",
        "practiceQuestions": [
          {
            "q": "Spot error: \"One of the students who has completed the project was awarded the scholarship.\"",
            "a": "Error is \"who has completed\". In relative clauses modifying a plural noun (\"students\"), the verb should be plural: \"who HAVE completed\"."
          }
        ]
      },
      {
        "id": "verb_comprehension_jumbles",
        "title": "Reading Comprehension & Para Jumbles",
        "subtopics": [
          "Main idea vs supporting detail identification",
          "Author tone detection (Analytical, Critical, Laudatory)",
          "Mandatory pairs in Para Jumbles",
          "Chronological and pronoun reference clues"
        ],
        "explanation": "Reading comprehension evaluates speed reading and context inference, while para jumbles test logical flow and discourse cohesion.",
        "codeExample": "Para Jumble Strategy:\n1. Find independent opening sentence (no pronouns like \"they\", \"he\", \"this\").\n2. Locate noun-pronoun mandatory pairs.\n3. Identify concluding sentence.",
        "practiceQuestions": [
          {
            "q": "How to quickly identify the introductory sentence of a Para Jumble?",
            "a": "Look for a broad sentence introducing the central theme or proper nouns, devoid of dangling contrast words (However, Although) or pronouns referring back to unintroduced antecedents."
          }
        ]
      }
    ]
  }
],

    codingQuestions: [
      {
        id: 'code_01',
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        companies: ['Google', 'Amazon', 'Microsoft', 'TCS Prime'],
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
          }
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        templates: {
          python: `def two_sum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\n# Driver code for testing\nimport json, sys\nif __name__ == '__main__':\n    nums = json.loads(sys.argv[1] if len(sys.argv) > 1 else "[2,7,11,15]")\n    target = int(sys.argv[2] if len(sys.argv) > 2 else "9")\n    print(json.dumps(two_sum(nums, target)))`,
          cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); ++i) {\n        int comp = target - nums[i];\n        if (map.count(comp)) return {map[comp], i};\n        map[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    std::vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    auto res = twoSum(nums, target);\n    std::cout << "[" << res[0] << "," << res[1] << "]" << std::endl;\n    return 0;\n}`,
          java: `import java.util.*;\n\nclass Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println(Arrays.toString(res));\n    }\n}`,
          c: `#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i;\n                res[1] = j;\n                return res;\n            }\n        }\n    }\n    *returnSize = 0;\n    return NULL;\n}\nint main() {\n    int nums[] = {2, 7, 11, 15};\n    int retSize = 0;\n    int* res = twoSum(nums, 4, 9, &retSize);\n    printf("[%d,%d]\\n", res[0], res[1]);\n    return 0;\n}`
        },
        testCases: [
          { input: '[2,7,11,15] 9', expectedOutput: '[0, 1]' },
          { input: '[3,2,4] 6', expectedOutput: '[1, 2]' },
          { input: '[3,3] 6', expectedOutput: '[0, 1]' }
        ]
      },
      {
        id: 'code_02',
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        difficulty: 'Easy',
        topic: 'Stack',
        companies: ['Amazon', 'Microsoft', 'Infosys', 'Capgemini'],
        description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
        examples: [
          { input: 's = "()"', output: 'true', explanation: 'Matching simple parentheses.' },
          { input: 's = "()[]{}"', output: 'true', explanation: 'All opening brackets match closing types.' },
          { input: 's = "(]"', output: 'false', explanation: 'Mismatched closing bracket.' }
        ],
        constraints: [
          '1 <= s.length <= 10^4',
          's consists of parentheses only \'()[]{}\'.'
        ],
        templates: {
          python: `def is_valid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else '#'\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n\nimport sys\nif __name__ == '__main__':\n    s = sys.argv[1] if len(sys.argv) > 1 else "()[]{}"\n    print("true" if is_valid(s) else "false")`,
          cpp: `#include <iostream>\n#include <stack>\n#include <unordered_map>\n\nbool isValid(std::string s) {\n    std::stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == ')' && st.top() != '(') return false;\n            if (c == '}' && st.top() != '{') return false;\n            if (c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}`,
          java: `import java.util.Stack;\nclass Solution {\n    public static boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
          c: `#include <stdbool.h>\n#include <string.h>\nbool isValid(char * s) {\n    int len = strlen(s);\n    char stack[10005];\n    int top = -1;\n    for(int i = 0; i < len; i++) {\n        char c = s[i];\n        if (c == '(' || c == '{' || c == '[') stack[++top] = c;\n        else {\n            if (top == -1) return false;\n            if (c == ')' && stack[top--] != '(') return false;\n            if (c == '}' && stack[top--] != '{') return false;\n            if (c == ']' && stack[top--] != '[') return false;\n        }\n    }\n    return top == -1;\n}`
        },
        testCases: [
          { input: '()', expectedOutput: 'true' },
          { input: '()[]{}', expectedOutput: 'true' },
          { input: '(]', expectedOutput: 'false' },
          { input: '([)]', expectedOutput: 'false' },
          { input: '{[]}', expectedOutput: 'true' }
        ]
      },
      {
        id: 'code_03',
        title: 'Merge Two Sorted Lists',
        slug: 'merge-two-sorted-lists',
        difficulty: 'Easy',
        topic: 'Linked List',
        companies: ['Microsoft', 'Amazon', 'Cognizant', 'TCS'],
        description: 'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
        examples: [
          { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
          { input: 'list1 = [], list2 = []', output: '[]' }
        ],
        constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
        templates: {
          python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef merge_two_lists(l1, l2):\n    dummy = ListNode(0)\n    tail = dummy\n    while l1 and l2:\n        if l1.val < l2.val:\n            tail.next = l1\n            l1 = l1.next\n        else:\n            tail.next = l2\n            l2 = l2.next\n        tail = tail.next\n    tail.next = l1 or l2\n    return dummy.next`,
          cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    if(!l1) return l2;\n    if(!l2) return l1;\n    if(l1->val < l2->val) {\n        l1->next = mergeTwoLists(l1->next, l2);\n        return l1;\n    } else {\n        l2->next = mergeTwoLists(l1, l2->next);\n        return l2;\n    }\n}`,
          java: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    if(l1 == null) return l2;\n    if(l2 == null) return l1;\n    if(l1.val < l2.val){\n        l1.next = mergeTwoLists(l1.next, l2);\n        return l1;\n    } else {\n        l2.next = mergeTwoLists(l1, l2.next);\n        return l2;\n    }\n}`,
          c: `struct ListNode* mergeTwoLists(struct ListNode* l1, struct ListNode* l2) {\n    if (!l1) return l2;\n    if (!l2) return l1;\n    if (l1->val < l2->val) {\n        l1->next = mergeTwoLists(l1->next, l2);\n        return l1;\n    } else {\n        l2->next = mergeTwoLists(l1, l2->next);\n        return l2;\n    }\n}`
        },
        testCases: [
          { input: '[1,2,4] [1,3,4]', expectedOutput: '[1, 1, 2, 3, 4, 4]' }
        ]
      },
      {
        id: 'code_04',
        title: 'Longest Substring Without Repeating Characters',
        slug: 'longest-substring-without-repeating-characters',
        difficulty: 'Medium',
        topic: 'Strings & Sliding Window',
        companies: ['Amazon', 'Google', 'Accenture', 'Microsoft'],
        description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
        examples: [
          { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
          { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
          { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
        ],
        constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
        templates: {
          python: `def length_of_longest_substring(s: str) -> int:\n    char_index = {}\n    left = 0\n    max_len = 0\n    for right, char in enumerate(s):\n        if char in char_index and char_index[char] >= left:\n            left = char_index[char] + 1\n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nimport sys\nif __name__ == '__main__':\n    s = sys.argv[1] if len(sys.argv) > 1 else "abcabcbb"\n    print(length_of_longest_substring(s))`,
          cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nint lengthOfLongestSubstring(std::string s) {\n    std::vector<int> dict(256, -1);\n    int maxLen = 0, start = -1;\n    for (int i = 0; i < s.length(); i++) {\n        if (dict[s[i]] > start) start = dict[s[i]];\n        dict[s[i]] = i;\n        maxLen = std::max(maxLen, i - start);\n    }\n    return maxLen;\n}`,
          java: `import java.util.*;\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int[] map = new int[256];\n        Arrays.fill(map, -1);\n        int max = 0, start = -1;\n        for (int i = 0; i < s.length(); i++) {\n            if (map[s.charAt(i)] > start) start = map[s.charAt(i)];\n            map[s.charAt(i)] = i;\n            max = Math.max(max, i - start);\n        }\n        return max;\n    }\n}`,
          c: `#include <string.h>\n#include <stdio.h>\nint lengthOfLongestSubstring(char * s) {\n    int dict[256];\n    memset(dict, -1, sizeof(dict));\n    int maxLen = 0, start = -1;\n    for(int i = 0; s[i] != '\\0'; i++) {\n        if (dict[(unsigned char)s[i]] > start) start = dict[(unsigned char)s[i]];\n        dict[(unsigned char)s[i]] = i;\n        if (i - start > maxLen) maxLen = i - start;\n    }\n    return maxLen;\n}`
        },
        testCases: [
          { input: 'abcabcbb', expectedOutput: '3' },
          { input: 'bbbbb', expectedOutput: '1' },
          { input: 'pwwkew', expectedOutput: '3' },
          { input: '', expectedOutput: '0' }
        ]
      },
      {
        id: 'code_05',
        title: 'Trapping Rain Water',
        slug: 'trapping-rain-water',
        difficulty: 'Hard',
        topic: 'Two Pointers & Dynamic Programming',
        companies: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs'],
        description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        examples: [
          { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map traps 6 units of rain water.' },
          { input: 'height = [4,2,0,3,2,5]', output: '9' }
        ],
        constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
        templates: {
          python: `def trap(height):\n    if not height: return 0\n    left, right = 0, len(height) - 1\n    left_max, right_max = height[left], height[right]\n    water = 0\n    while left < right:\n        if left_max < right_max:\n            left += 1\n            left_max = max(left_max, height[left])\n            water += left_max - height[left]\n        else:\n            right -= 1\n            right_max = max(right_max, height[right])\n            water += right_max - height[right]\n    return water\n\nimport json, sys\nif __name__ == '__main__':\n    height = json.loads(sys.argv[1] if len(sys.argv) > 1 else "[0,1,0,2,1,0,1,3,2,1,2,1]")\n    print(trap(height))`,
          cpp: `#include <vector>\n#include <algorithm>\nint trap(std::vector<int>& height) {\n    int l = 0, r = height.size() - 1;\n    int lMax = 0, rMax = 0, res = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lMax) lMax = height[l];\n            else res += lMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rMax) rMax = height[r];\n            else res += rMax - height[r];\n            r--;\n        }\n    }\n    return res;\n}`,
          java: `class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1;\n        int lMax = 0, rMax = 0, res = 0;\n        while(l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lMax) lMax = height[l];\n                else res += lMax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rMax) rMax = height[r];\n                else res += rMax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n}`,
          c: `int trap(int* height, int heightSize) {\n    int l = 0, r = heightSize - 1;\n    int lMax = 0, rMax = 0, res = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lMax) lMax = height[l];\n            else res += lMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rMax) rMax = height[r];\n            else res += rMax - height[r];\n            r--;\n        }\n    }\n    return res;\n}`
        },
        testCases: [
          { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
          { input: '[4,2,0,3,2,5]', expectedOutput: '9' }
        ]
      }
    ],

    companies: [
      {
        id: 'tcs',
        name: 'Tata Consultancy Services (TCS)',
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
        cadres: ['Ninja (3.36 - 3.6 LPA)', 'Digital (7.0 - 7.5 LPA)', 'Prime (9.0 - 11.5 LPA)'],
        eligibility: {
          cgpa: '60% or 6.0 CGPA throughout (10th, 12th, B.Tech)',
          backlogs: 'Maximum 1 active backlog at time of test (must clear before joining)',
          branches: 'All Engineering branches (CSE, IT, ECE, EEE, Mechanical, Civil)'
        },
        selectionProcess: [
          { round: 'Round 1', name: 'NQT (National Qualifier Test)', desc: 'Cognitive (Quant, Verbal, Reasoning) + Advanced Coding (2 questions: 1 medium, 1 hard)' },
          { round: 'Round 2', name: 'Technical Interview', desc: 'Core CS (OOPs, DBMS, OS), Resume projects, DSA live coding, and coding round review' },
          { round: 'Round 3', name: 'Managerial & HR', desc: 'Behavioral scenarios, relocation willingness, night shift flexibility, and leadership traits' }
        ],
        faq: [
          { q: 'What is the cutoff score for TCS Digital vs Prime?', a: 'Top 5-10% scorers in Advanced Coding and Advanced Cognitive sections get direct calls for Digital and Prime interviews.' },
          { q: 'Is there negative marking in TCS NQT?', a: 'Standard Cognitive sections generally do not have negative marking, but accuracy score is tracked.' }
        ],
        technicalQuestions: [
          { q: 'Explain normalization and what is 3NF vs BCNF.', a: '3NF requires that every non-prime attribute is non-transitively dependent on candidate keys. BCNF is stricter: for every functional dependency X -> Y, X must be a super key.' },
          { q: 'Write a query to find the second highest salary in MySQL.', a: 'SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);' },
          { q: 'Difference between Process and Thread?', a: 'A process is an execution unit with dedicated virtual memory. A thread is a lightweight flow within a process sharing heap, code, and global variables.' }
        ],
        aptitudeQuestions: [
          { q: 'If 12 men can complete a work in 16 days, how many men are required to finish it in 24 days?', a: 'Men * Days = Work => 12 * 16 = 192 man-days. Required men = 192 / 24 = 8 men.' }
        ],
        hrQuestions: [
          { q: 'Why do you want to join TCS over other IT service firms?', a: 'Highlight TCS vast global scale, diverse client domain expertise, continuous upskilling initiatives like Elevate, and stable career growth.' },
          { q: 'Are you ready to relocate and work in rotational shifts?', a: 'Yes, being early in my professional career, I welcome exposure to dynamic environments, client timezones, and diverse project teams.' }
        ],
        prepTips: [
          'Practice hands-on coding on string parsing and dynamic programming; compilers in NQT are strict on boundary cases.',
          'Know every line of code in the projects listed on your resume; TCS interviewers frequently ask you to draw flowcharts.'
        ]
      },
      {
        id: 'infosys',
        name: 'Infosys',
        logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=150&q=80',
        cadres: ['System Engineer (3.6 LPA)', 'Specialist Programmer (9.5 LPA)', 'Digital Specialist Engineer (6.25 LPA)'],
        eligibility: {
          cgpa: '65% or 6.5 CGPA in 10th, 12th, and Diploma/Graduation',
          backlogs: 'Zero active backlogs at the time of process',
          branches: 'BE, B.Tech, M.Tech, MCA, M.Sc (CS/IT)'
        },
        selectionProcess: [
          { round: 'Round 1', name: 'InfyTQ / HackWithInfy / On-Campus Online Test', desc: 'Reasoning Ability, Technical Ability, Pseudocode, and Hands-on Coding' },
          { round: 'Round 2', name: 'Technical & HR Combined Interview', desc: 'Object-Oriented Programming, Java/Python deep dive, DSA, and Situational questions' }
        ],
        faq: [
          { q: 'What is HackWithInfy?', a: 'Infosys flagship coding competition offering direct job opportunities for Specialist Programmer (9.5 LPA) and DSE (6.25 LPA).' }
        ],
        technicalQuestions: [
          { q: 'What is Garbage Collection in Java and how does System.gc() work?', a: 'GC automatically frees memory of unreachable objects. System.gc() merely requests the JVM to run garbage collection but does not guarantee immediate execution.' },
          { q: 'Explain ACID properties with real banking transfer example.', a: 'Atomicity: Money debited from account A must be credited to B; if server crashes midway, transaction rolls back.' }
        ],
        aptitudeQuestions: [
          { q: 'Find the odd one out: 3, 5, 11, 14, 17, 21', a: '14 is even, others are odd; or 14 and 21 are composite while 3, 5, 11, 17 are prime numbers.' }
        ],
        hrQuestions: [
          { q: 'Where do you see yourself in 3 years?', a: 'I see myself as a seasoned engineer having mastered production architectures, taking ownership of key modules, and guiding junior hires.' }
        ],
        prepTips: [
          'Specialist Programmer role tests heavy DP, Graph BFS/DFS, and Segment Trees.',
          'Infosys pseudocode section tests edge cases in loop iterations and bitwise shifts.'
        ]
      },
      {
        id: 'amazon',
        name: 'Amazon',
        logo: 'https://images.unsplash.com/photo-1523474253243-283a0181316a?auto=format&fit=crop&w=150&q=80',
        cadres: ['SDE-1 (28 - 45 LPA CTC)'],
        eligibility: {
          cgpa: 'Typically 7.0+ CGPA, no active backlogs',
          backlogs: '0 active backlogs',
          branches: 'CSE, IT, ECE and related engineering disciplines'
        },
        selectionProcess: [
          { round: 'Round 1', name: 'Online Assessment (OA)', desc: '2 Coding questions (Medium/Hard) + Work Style Assessment (Amazon 16 Leadership Principles)' },
          { round: 'Round 2', name: 'Technical Round 1', desc: 'DSA: Binary Trees, Heaps, Graphs, Dynamic Programming' },
          { round: 'Round 3', name: 'Technical Round 2', desc: 'DSA + Low Level Design (LLD), Object-Oriented Design patterns' },
          { round: 'Round 4', name: 'Bar Raiser Round', desc: 'Deep dive into LP (Customer Obsession, Ownership, Bias for Action) and complex problem solving' }
        ],
        faq: [
          { q: 'What is the Amazon Bar Raiser round?', a: 'An interview conducted by an interviewer from a different team whose sole mission is to ensure the candidate raises the bar of talent compared to current Amazon employees.' }
        ],
        technicalQuestions: [
          { q: 'Design an LRU Cache with O(1) get and put operations.', a: 'Combine a Hash Map (for O(1) key-to-node lookup) with a Doubly Linked List (for O(1) node detachment and head insertion for most-recently-used).' },
          { q: 'Find median in a stream of integers.', a: 'Maintain two heaps: a max-heap for lower half and a min-heap for upper half, balancing sizes to differ by at most 1.' }
        ],
        aptitudeQuestions: [
          { q: 'Probability of getting sum 7 or 11 when rolling two 6-sided dice?', a: 'Sum 7 combinations: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. Sum 11: (5,6),(6,5) = 2. Total = 8/36 = 2/9.' }
        ],
        hrQuestions: [
          { q: 'Tell me about a time you had a disagreement with your peer and how you resolved it.', a: 'Answer strictly using the STAR format (Situation, Task, Action, Result) highlighting Amazon Leadership Principle "Have Backbone; Disagree and Commit".' }
        ],
        prepTips: [
          'Study Amazon 16 Leadership Principles thoroughly and prepare 2 real-life stories for each principle.',
          'Focus on optimal time and space complexity; state trade-offs explicitly before writing code.'
        ]
      },
      {
        id: 'google',
        name: 'Google',
        logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=150&q=80',
        cadres: ['Software Engineer L3 (35 - 55 LPA CTC)'],
        eligibility: {
          cgpa: 'No strict CGPA cutoff, demonstrated coding excellence and project portfolio',
          backlogs: 'None at joining',
          branches: 'Open to all with strong algorithmic skills'
        },
        selectionProcess: [
          { round: 'Round 1', name: 'Google Online Challenge (GOC)', desc: '2 Complex Algorithmic problems in 60 minutes' },
          { round: 'Round 2-4', name: 'Technical Interviews (3-4 rounds)', desc: 'In-depth DSA, mathematical analysis, scalability, edge case scrutiny' },
          { round: 'Round 5', name: 'Googliness & Leadership', desc: 'Navigating ambiguity, collaboration, diversity, ethical decision-making' }
        ],
        faq: [
          { q: 'Does Google allow syntax lookup during the interview?', a: 'Google uses Google Docs or a syntax-free editor. You are judged on algorithm correctness, clean variable naming, modular design, and reasoning rather than library memorization.' }
        ],
        technicalQuestions: [
          { q: 'Given a directed graph, how do you find strongly connected components?', a: 'Use Tarjan\'s algorithm (based on DFS low-link values in O(V+E)) or Kosaraju\'s algorithm (two DFS passes with graph transposition).' }
        ],
        aptitudeQuestions: [
          { q: 'You have 25 horses and need to find the top 3 fastest horses in the minimum number of races. Each race can have at most 5 horses and no stopwatch.', a: 'Classic puzzle: 7 races total. Race 5 groups of 5, then race winners (race 6), then finalists from top groups (race 7).' }
        ],
        hrQuestions: [
          { q: 'Describe a project where requirements were completely ambiguous. How did you proceed?', a: 'Highlight scoping out MVP, conducting stakeholder surveys, building rapid telemetry prototypes, and iterating with feedback.' }
        ],
        prepTips: [
          'Communicate thoughts out loud continuously; silence for minutes hurts your evaluation.',
          'Test your solution with dry runs on empty inputs, single element, negative numbers, and duplicates before telling the interviewer you are done.'
        ]
      },
      {
        id: 'microsoft',
        name: 'Microsoft',
        logo: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&w=150&q=80',
        cadres: ['Software Engineer (40 - 50 LPA CTC)'],
        eligibility: { cgpa: '7.5+ CGPA', backlogs: '0 backlogs', branches: 'CSE / IT / ECE' },
        selectionProcess: [
          { round: 'Round 1', name: 'Codility Online Assessment', desc: '3 problems (Strings, Arrays, Graphs)' },
          { round: 'Round 2-3', name: 'Technical Interviews', desc: 'Data Structures, Memory management, LLD, Code quality' },
          { round: 'Round 4', name: 'AA (As Appropriate / Hiring Manager)', desc: 'System architecture, cultural alignment, past projects' }
        ],
        faq: [{ q: 'What is Microsoft preferred coding language?', a: 'C++, C#, Java, or Python are all warmly welcomed.' }],
        technicalQuestions: [{ q: 'How would you detect a cycle in a linked list and find the start of the cycle?', a: 'Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare). Once slow meets fast, reset slow to head; advance both one step at a time; they meet at cycle entry.' }],
        aptitudeQuestions: [{ q: 'Find angle between hour hand and minute hand at 3:15.', a: 'Hour hand angle = 3*30 + 15*0.5 = 97.5 deg. Minute hand = 15*6 = 90 deg. Difference = 7.5 degrees.' }],
        hrQuestions: [{ q: 'Why Microsoft?', a: 'Mention Microsoft mission to empower every person and organization on the planet to achieve more, Azure cloud innovations, and growth mindset culture.' }],
        prepTips: ['Write production-ready code with clear guard clauses and exception handling.']
      },
      {
        id: 'wipro',
        name: 'Wipro',
        logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80',
        cadres: ['Elite (3.5 LPA)', 'Turbo (6.5 LPA)'],
        eligibility: { cgpa: '60% or 6.0 CGPA', backlogs: 'Max 1 backlog allowed', branches: 'All Engineering' },
        selectionProcess: [
          { round: 'Round 1', name: 'NLTH Online Assessment', desc: 'Aptitude, Written Communication Essay, Coding' },
          { round: 'Round 2', name: 'Technical & HR Discussion', desc: 'Core CS concepts and communication assessment' }
        ],
        faq: [{ q: 'Is there an essay writing section in Wipro?', a: 'Yes, Wipro uses automated AI essay grading that checks grammar, vocabulary, sentence structure, and coherence.' }],
        technicalQuestions: [{ q: 'What is inheritance and what are its types?', a: 'Single, Multilevel, Multiple (via interfaces in Java), Hierarchical, and Hybrid inheritance.' }],
        aptitudeQuestions: [{ q: 'A train 120m long passes a pole in 6s. What is its speed in km/h?', a: 'Speed = 120/6 = 20 m/s = 20 * (18/5) = 72 km/h.' }],
        hrQuestions: [{ q: 'Tell me about yourself in 90 seconds.', a: 'Structure: Background -> Academic achievements -> Technical skills & project highlight -> Career aspirations.' }],
        prepTips: ['Practice typing without grammatical errors for the essay section.']
      },
      {
        id: 'accenture',
        name: 'Accenture',
        logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=150&q=80',
        cadres: ['Associate Software Engineer - ASE (4.5 LPA)', 'Advanced ASE - FSE (6.5 LPA)'],
        eligibility: { cgpa: '65% or 6.5 CGPA', backlogs: 'No active backlogs', branches: 'All Engineering' },
        selectionProcess: [
          { round: 'Round 1', name: 'Cognitive & Technical Assessment', desc: 'Critical Thinking, Abstract Reasoning, MS Office, Pseudocode, Cloud Fundamentals' },
          { round: 'Round 2', name: 'Coding Assessment', desc: '2 coding problems' },
          { round: 'Round 3', name: 'Communication Assessment', desc: 'Automated voice assessment testing pronunciation, fluency, listening, retelling' },
          { round: 'Round 4', name: 'HR Interview', desc: 'Project discussion and situational ethics' }
        ],
        faq: [{ q: 'Is Round 1 elimination?', a: 'Yes, passing Cognitive & Technical threshold unlocks the Coding round immediately.' }],
        technicalQuestions: [{ q: 'What is Cloud Computing and what are IaaS, PaaS, and SaaS?', a: 'IaaS provides raw compute/storage (AWS EC2). PaaS provides runtime environment (Heroku). SaaS provides ready software (Google Workspace).' }],
        aptitudeQuestions: [{ q: 'Find the next term in series: 2, 6, 12, 20, 30, ?', a: 'Differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42.' }],
        hrQuestions: [{ q: 'How do you handle working with team members who have differing viewpoints?', a: 'Focus on objective data, active listening, finding common goals, and respectful communication.' }],
        prepTips: ['Use a good quality headset in a quiet room for the AI communication voice round.']
      },
      {
        id: 'cognizant',
        name: 'Cognizant',
        logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=150&q=80',
        cadres: ['GenC (4.0 LPA)', 'GenC Elevate (4.25 LPA)', 'GenC Next (6.75 LPA)'],
        eligibility: { cgpa: '60% throughout', backlogs: '0 backlogs', branches: 'CSE, IT, ECE, EEE' },
        selectionProcess: [
          { round: 'Round 1', name: 'GenC Assessment', desc: 'Quantitative, Analytical, Verbal, and Domain specific' },
          { round: 'Round 2', name: 'Technical & HR Interview', desc: 'Java/Python, DBMS, SQL, and Web basics' }
        ],
        faq: [{ q: 'Can GenC candidates be upgraded to GenC Next?', a: 'Yes, candidates performing exceptionally well in skill tests can be evaluated for GenC Next.' }],
        technicalQuestions: [{ q: 'What is a Primary Key vs Unique Key?', a: 'A table can have only one Primary Key and it cannot accept NULL values. Multiple Unique Keys can exist, and unique keys allow NULL values (depending on RDBMS).' }],
        aptitudeQuestions: [{ q: 'Cost price of 20 articles is equal to selling price of 16 articles. Find profit percent.', a: 'Profit% = (20 - 16)/16 * 100 = 4/16 * 100 = 25% profit.' }],
        hrQuestions: [{ q: 'What will you do if your project manager asks you to do something outside your job description?', a: 'I see it as an opportunity to broaden my versatility and solve customer pain points.' }],
        prepTips: ['Master SQL queries with GROUP BY, HAVING, and window functions like DENSE_RANK.']
      },
      {
        id: 'capgemini',
        name: 'Capgemini',
        logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=150&q=80',
        cadres: ['Analyst (4.25 LPA)', 'Senior Analyst (5.75 - 7.5 LPA)'],
        eligibility: { cgpa: '60% or 6.0 CGPA', backlogs: 'No backlogs', branches: 'Engineering branches' },
        selectionProcess: [
          { round: 'Round 1', name: 'Pseudocode Assessment', desc: 'Data structures, algorithm complexity, recursive tracing' },
          { round: 'Round 2', name: 'English Verbal & Game-Based Aptitude', desc: 'Grid challenge, motion challenge, inductive reasoning games' },
          { round: 'Round 3', name: 'Technical & HR Interview', desc: 'Core fundamentals and problem approach' }
        ],
        faq: [{ q: 'What is Capgemini Game-Based Aptitude?', a: 'Mini interactive games measuring short-term memory, reaction time, multi-tasking, and spatial reasoning.' }],
        technicalQuestions: [{ q: 'What is polymorphism and what are compile-time vs runtime polymorphism?', a: 'Compile-time is method overloading and operator overloading resolved at compile time. Runtime is method overriding via virtual methods resolved dynamically.' }],
        aptitudeQuestions: [{ q: 'In how many ways can letters of word "LEADER" be arranged?', a: 'Total letters = 6, E repeats twice => 6! / 2! = 720 / 2 = 360 ways.' }],
        hrQuestions: [{ q: 'What are your strengths and weaknesses?', a: 'State genuine strengths with examples, and a real weakness that you are actively improving with tangible steps.' }],
        prepTips: ['Practice recursive tree tracing for pseudocode questions.']
      },
      {
        id: 'deloitte',
        name: 'Deloitte',
        logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=150&q=80',
        cadres: ['Analyst (7.6 LPA)', 'Consultant (11 - 13 LPA)'],
        eligibility: { cgpa: '6.5+ CGPA', backlogs: 'No active backlogs', branches: 'All Engineering & Management' },
        selectionProcess: [
          { round: 'Round 1', name: 'Deloitte Aptitude & Verbal Test', desc: 'Logical, Quant, Verbal, and Versant English' },
          { round: 'Round 2', name: 'JAM (Just A Minute) / Case Study / Tech', desc: 'Case interview, business scenario analysis, tech stack' },
          { round: 'Round 3', name: 'Partner / HR Interview', desc: 'Client engagement, consulting mindset, communication' }
        ],
        faq: [{ q: 'What is the JAM round in Deloitte?', a: 'Speaking fluently on a given topic for 60 seconds without hesitation, repetition, or grammatical errors.' }],
        technicalQuestions: [{ q: 'What is an API and difference between REST and SOAP?', a: 'REST is architectural style using HTTP methods, stateless, and typically uses JSON. SOAP is a protocol with strict XML contracts and WS-Security standards.' }],
        aptitudeQuestions: [{ q: 'A sum of money doubles itself in 5 years at simple interest. In how many years will it become 4 times?', a: 'Doubling means interest earned = principal P in 5 years. For 4 times, interest needed = 3P => 3 * 5 = 15 years.' }],
        hrQuestions: [{ q: 'How would you explain a complex technical bug to a non-technical client?', a: 'Use analogies from everyday life, focus on business impact rather than stack traces, and outline the resolution roadmap clearly.' }],
        prepTips: ['Work on clear verbal articulation and professional consulting demeanor.']
      }
    ],

    aptitudeQuestions: [
      {
        id: 'apt_01',
        category: 'Quantitative Aptitude',
        topic: 'Time and Work',
        difficulty: 'Easy',
        question: 'A can do a piece of work in 10 days, and B can do the same work in 15 days. In how many days can they complete the work working together?',
        options: ['5 days', '6 days', '7.5 days', '8 days'],
        correctAnswer: 1, // 0-indexed -> 6 days
        explanation: 'Work done by A in 1 day = 1/10. Work done by B in 1 day = 1/15.\nTogether in 1 day = 1/10 + 1/15 = (3 + 2)/30 = 5/30 = 1/6.\nTherefore, together they finish the work in 1 / (1/6) = 6 days.'
      },
      {
        id: 'apt_02',
        category: 'Quantitative Aptitude',
        topic: 'Percentages & Profit Loss',
        difficulty: 'Medium',
        question: 'A shopkeeper marks an article 40% above cost price and then allows a discount of 20% on the marked price. What is his net profit percentage?',
        options: ['12%', '16%', '20%', '14%'],
        correctAnswer: 0, // 12%
        explanation: 'Let CP = 100. Marked Price (MP) = 140.\nDiscount = 20% of 140 = 28.\nSelling Price (SP) = 140 - 28 = 112.\nNet profit = 112 - 100 = 12%.'
      },
      {
        id: 'apt_03',
        category: 'Logical Reasoning',
        topic: 'Blood Relations',
        difficulty: 'Easy',
        question: 'Pointing to a photograph, a woman says: "He is the only son of my mother\'s only daughter." How is the boy related to the woman?',
        options: ['Brother', 'Son', 'Nephew', 'Husband'],
        correctAnswer: 1, // Son
        explanation: '"My mother\'s only daughter" is the woman herself. Therefore, the boy is the only son of the woman, so he is her Son.'
      },
      {
        id: 'apt_04',
        category: 'Logical Reasoning',
        topic: 'Syllogism',
        difficulty: 'Medium',
        question: 'Statements:\n1. All cars are vehicles.\n2. Some vehicles are electric.\n\nConclusions:\nI. Some cars are electric.\nII. Some electric are vehicles.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both follow', 'Neither follows'],
        correctAnswer: 1, // Only II follows
        explanation: 'Since "Some vehicles are electric", its converse "Some electric are vehicles" definitely holds true. There is no direct overlap guaranteed between cars and electric, so I does not necessarily follow.'
      },
      {
        id: 'apt_05',
        category: 'Verbal Ability',
        topic: 'Sentence Correction & Grammar',
        difficulty: 'Easy',
        question: 'Identify the grammatically correct sentence:',
        options: [
          'Neither the manager nor the employees was present in the meeting.',
          'Neither the manager nor the employees were present in the meeting.',
          'Neither the manager or the employees were present in the meeting.',
          'Neither the manager nor the employees is present in the meeting.'
        ],
        correctAnswer: 1, // Neither... nor... verb agrees with nearer subject 'employees' (plural) -> were
        explanation: 'In "neither... nor" constructions, the verb agrees in number with the subject closest to it. Here "employees" is plural, so plural verb "were" is required.'
      },
      {
        id: 'apt_06',
        category: 'Data Interpretation',
        topic: 'Tables & Charts',
        difficulty: 'Medium',
        question: 'Company revenue in 2024 was $120M, and expenses were $80M. In 2025, revenue increased by 25% while expenses increased by 10%. What was the percentage increase in net profit?',
        options: ['45%', '55%', '65%', '50%'],
        correctAnswer: 1, // 55%
        explanation: '2024 Profit = 120 - 80 = $40M.\n2025 Revenue = 120 * 1.25 = $150M.\n2025 Expenses = 80 * 1.10 = $88M.\n2025 Profit = 150 - 88 = $62M.\nIncrease in profit = 62 - 40 = $22M.\nPercentage increase = (22 / 40) * 100 = 55%.'
      },
      {
        id: 'apt_07',
        category: 'Analytical Reasoning',
        topic: 'Seating Arrangement',
        difficulty: 'Hard',
        question: 'Five friends A, B, C, D, and E are sitting in a row facing north. C is sitting in the center. A is sitting at the extreme left. B is immediately to the right of C. D is not at the extreme right. Who is sitting at the extreme right?',
        options: ['B', 'E', 'D', 'C'],
        correctAnswer: 1, // E
        explanation: 'Positions: 1 2 3 4 5.\nA is at extreme left -> pos 1.\nC is in center -> pos 3.\nB is immediately right of C -> pos 4.\nRemaining positions are 2 and 5. D is not at extreme right, so D is at pos 2.\nTherefore, E must be at pos 5 (extreme right).'
      }
    ],

    questionBank: [
      {
        id: 'qb_01',
        category: 'Technical',
        subCategory: 'Data Structures',
        difficulty: 'Medium',
        question: 'What is the difference between a Binary Search Tree (BST) and an AVL Tree? Why is AVL self-balancing?',
        answer: 'A BST satisfies the invariant that left subtree keys < node key < right subtree keys. However, standard BST can degenerate into a linked list with O(N) worst-case time complexity upon skewed insertions.\n\nAn AVL tree is a strictly self-balancing BST where the difference in heights of left and right subtrees (Balance Factor = height(left) - height(right)) for any node cannot exceed {-1, 0, 1}. If insertion/deletion violates this balance, it executes O(1) single (LL, RR) or double (LR, RL) rotations, guaranteeing O(log N) lookup, insertion, and deletion.',
        companyTags: ['Amazon', 'Microsoft', 'Google'],
        keyConcepts: ['Rotations', 'Balance Factor', 'O(log N) Guarantee']
      },
      {
        id: 'qb_02',
        category: 'DBMS',
        subCategory: 'Transactions & Concurrency',
        difficulty: 'Hard',
        question: 'Explain Two-Phase Locking (2PL) protocol and how it ensures serializability.',
        answer: '2PL is a concurrency control method that guarantees serializability through two distinct phases:\n1. Growing Phase: A transaction can acquire locks (Shared or Exclusive) but cannot release any lock.\n2. Shrinking Phase: Once a transaction releases its first lock, it cannot acquire any new lock; it can only release remaining locks.\n\nThe point where the transaction acquires its final lock is called the Lock Point. By ordering transactions by their lock points, 2PL prevents conflicts and ensures conflict serializability.',
        companyTags: ['Oracle', 'Google', 'Amazon'],
        keyConcepts: ['Shared Lock', 'Exclusive Lock', 'Lock Point', 'Serializability']
      },
      {
        id: 'qb_03',
        category: 'HR',
        subCategory: 'Behavioral & Leadership',
        difficulty: 'Medium',
        question: 'Tell me about a time when you missed a deadline or faced a major project roadblock.',
        answer: 'Winning Framework (STAR):\n- Situation: During our final-year capstone project, our third-party authentication API changed its contract two weeks prior to the project showcase.\n- Task: As the backend lead, I had to ensure user authentication was functional without pushing back our deadline.\n- Action: I called an emergency triage meeting, notified our faculty advisor early, split the workload, and refactored our auth provider using an open-source JWT implementation over a weekend sprint.\n- Result: We delivered the project on time with 99.8% test coverage, and our advisor commended our proactive crisis management.',
        companyTags: ['TCS', 'Infosys', 'Accenture', 'Microsoft'],
        keyConcepts: ['STAR Method', 'Accountability', 'Crisis Triage']
      },
      {
        id: 'qb_04',
        category: 'OOPs',
        subCategory: 'Design Principles',
        difficulty: 'Easy',
        question: 'What are SOLID principles in Object-Oriented Design?',
        answer: 'SOLID stands for:\n1. Single Responsibility Principle (SRP): A class should have only one reason to change.\n2. Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification.\n3. Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without breaking client code.\n4. Interface Segregation Principle (ISP): Clients should not be forced to depend on interfaces they do not use.\n5. Dependency Inversion Principle (DIP): High-level modules should not depend on low-level modules; both should depend on abstractions.',
        companyTags: ['Amazon', 'Wipro', 'Capgemini', 'Deloitte'],
        keyConcepts: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP']
      },
      {
        id: 'qb_05',
        category: 'Operating Systems',
        subCategory: 'Concurrency & Deadlocks',
        difficulty: 'Medium',
        question: 'What is a Race Condition and how do Semaphores and Mutexes prevent it?',
        answer: 'A Race Condition occurs in concurrent execution when the final outcome of multiple threads depends on the non-deterministic order of execution or timing. It happens when multiple threads access shared mutable data without proper synchronization.\n\n- Mutex (Mutual Exclusion): A locking mechanism owned by a single thread. Only the thread that acquired the lock can release it.\n- Semaphore: A signaling mechanism with an integer counter. Wait/P() decrements counter, Signal/V() increments counter. Counting semaphores allow access to N concurrent resources.',
        companyTags: ['Google', 'Microsoft', 'Qualcomm'],
        keyConcepts: ['Critical Section', 'Mutex', 'Counting Semaphore', 'Atomic operations']
      }
    ],

    badges: [
      { id: 'badge_first_code', name: 'First Milestone', icon: 'Award', desc: 'Solved your first coding problem', xpReward: 50 },
      { id: 'badge_code_warrior', name: 'Code Warrior', icon: 'Code', desc: 'Solved 10 coding challenges', xpReward: 200 },
      { id: 'badge_streak_7', name: 'Relentless Streak', icon: 'Flame', desc: 'Maintained a 7-day study streak', xpReward: 150 },
      { id: 'badge_interview_ready', name: 'Mock Interview Ace', icon: 'Video', desc: 'Completed an AI Mock Interview with score > 80%', xpReward: 250 },
      { id: 'badge_aptitude_master', name: 'Aptitude Master', icon: 'Brain', desc: 'Scored 90%+ on any Aptitude Test', xpReward: 100 },
      { id: 'badge_resume_pro', name: 'ATS Resume Pro', icon: 'FileText', desc: 'Achieved an ATS Resume Score above 85%', xpReward: 100 }
    ],

    tasks: [
      {
        id: 'task_01',
        userId: 'usr_student_01',
        title: 'Solve 2 LeetCode Mediums on Sliding Window',
        category: 'Coding',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        priority: 'High',
        completed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_02',
        userId: 'usr_student_01',
        title: 'Revise DBMS Normalization & B+ Trees',
        category: 'Core CS',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        priority: 'Medium',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_03',
        userId: 'usr_student_01',
        title: 'Take TCS Digital Mock Test',
        category: 'Company Prep',
        dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        priority: 'High',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ],

    notifications: [
      {
        id: 'notif_01',
        userId: 'usr_student_01',
        title: 'Great Job! 6-Day Streak',
        message: 'You are on a 6-day study streak. Complete today\'s goal to hit 7 days and unlock the Relentless Streak badge!',
        type: 'streak',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'notif_02',
        userId: 'usr_student_01',
        title: 'Upcoming Mock Interview Reminder',
        message: 'Your SDE-1 Technical Mock Interview session is scheduled for tomorrow at 4:00 PM.',
        type: 'interview',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'notif_03',
        userId: 'usr_student_01',
        title: 'New Company Guide Added: TCS Prime & Digital',
        message: 'Check out new company-specific interview questions and test patterns.',
        type: 'roadmap',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],

    submissions: [
      {
        id: 'sub_01',
        userId: 'usr_student_01',
        questionId: 'code_01',
        language: 'python',
        code: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []`,
        status: 'Accepted',
        runtimeMs: 42,
        memoryKb: 14200,
        testsPassed: 3,
        totalTests: 3,
        createdAt: new Date(Date.now() - 43200000).toISOString()
      }
    ],

    mockInterviews: [
      {
        id: 'mock_01',
        userId: 'usr_student_01',
        interviewType: 'Technical Interview',
        role: 'Full Stack Developer',
        difficulty: 'Intermediate',
        totalQuestions: 3,
        score: 85,
        breakdown: {
          accuracy: 88,
          clarity: 82,
          problemSolving: 85,
          completeness: 85
        },
        strengths: ['Clear explanation of React reconciliation', 'Strong algorithmic analysis', 'Good mention of edge cases'],
        weaknesses: ['Could elaborate more on database transaction isolation levels'],
        recommendations: 'Deepen knowledge in SQL indexing and practice talking through recursive space complexities.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],

    resumes: [
      {
        id: 'res_01',
        userId: 'usr_student_01',
        title: 'Software Engineer Resume (ATS 2026)',
        template: 'modern',
        personalInfo: {
          fullName: 'Alex Vance',
          email: 'alex.vance@example.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA / Bangalore, India',
          linkedin: 'https://linkedin.com/in/alexvance',
          github: 'https://github.com/alexvance',
          portfolio: 'https://alexvance.dev'
        },
        careerObjective: 'Motivated Computer Science graduate with strong foundations in Data Structures, Algorithms, Full-Stack Architecture, and Distributed Systems, seeking an SDE-1 role to build high-scale, resilient user-facing products.',
        education: [
          { degree: 'B.Tech in Computer Science and Engineering', institution: 'Apex Institute of Technology', year: '2023 - 2027', score: 'CGPA: 8.8 / 10.0' }
        ],
        skills: {
          languages: ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL'],
          frameworks: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Next.js', 'FastAPI'],
          tools: ['Git', 'Docker', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS (S3, EC2)', 'Linux']
        },
        experience: [
          {
            role: 'Software Engineering Intern',
            company: 'CloudPulse Technologies',
            duration: 'Jun 2025 - Aug 2025',
            location: 'Remote',
            bullets: [
              'Developed RESTful microservices in Node.js & Redis, reducing API response latency by 34% across 100k daily queries.',
              'Engineered automated CI/CD pipeline using GitHub Actions, cutting staging deployment duration from 25 to 6 minutes.',
              'Collaborated with senior architects to refactor database queries, reducing slow-query spikes under high concurrent loads.'
            ]
          }
        ],
        projects: [
          {
            title: 'Real-Time Collaborative Code Editor',
            techStack: 'React, Node.js, WebSockets, Redis, Monaco Editor',
            bullets: [
              'Built multi-cursor real-time collaborative code editor supporting 50+ concurrent users with sub-50ms sync latency.',
              'Implemented operational transformation algorithm to handle concurrent edits without conflicts or text corruption.',
              'Deployed isolated containerized code execution sandbox executing Python, C++, and Java with strict CPU/memory quotas.'
            ],
            githubUrl: 'https://github.com/alexvance/collab-code',
            liveUrl: 'https://collab-code.demo.app'
          },
          {
            title: 'Distributed Task Queue System',
            techStack: 'Python, FastAPI, Celery, Redis, PostgreSQL',
            bullets: [
              'Architected asynchronous background worker system processing 5,000+ daily scheduled jobs with automatic retry queues.',
              'Integrated Prometheus telemetry and Grafana dashboards for real-time monitoring of queue lag and failure rates.'
            ],
            githubUrl: 'https://github.com/alexvance/task-queue',
            liveUrl: 'https://tasks.demo.app'
          }
        ],
        certifications: [
          'AWS Certified Cloud Practitioner (2025)',
          'Meta Front-End Developer Professional Certificate'
        ],
        achievements: [
          'Global Rank 342 in Google Kick Start / LeetCode Knight (Peak Rating: 1940+)',
          'Winner of Smart India Hackathon College Round 2025'
        ],
        atsScore: 88,
        atsReview: {
          score: 88,
          verdict: 'Excellent ATS Alignment',
          feedback: [
            'Strong action verbs (Developed, Engineered, Architected, Refactored) used consistently.',
            'Metrics and quantifiable results (34% reduction, 50ms sync, 100k queries) are present.',
            'Clear section headers recognized by modern Applicant Tracking Systems.',
            'Recommendation: Consider including explicit cloud keywords like Kubernetes and Terraform if targeting Cloud SDE roles.'
          ]
        },
        updatedAt: new Date().toISOString()
      }
    ],

    userProgress: {
      usr_student_01: {
        completedTopics: ['c_basics', 'cpp_oops', 'dsa_arrays_strings', 'dbms_acid_norm'],
        bookmarkedQuestions: ['code_01', 'code_04'],
        masteredQuestions: ['qb_01', 'qb_04'],
        stats: {
          questionsSolved: 14,
          learningHours: 32,
          testsTaken: 8,
          mockInterviewsCount: 3,
          overallCompletionPct: 42
        }
      }
    }
  };
}

// Ensure database file exists
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = getInitialData();
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    dbData = initialData;
  } else {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      dbData = JSON.parse(content);
    } catch (e) {
      console.error('Error reading db.json, recreating initial data:', e);
      const initialData = getInitialData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      dbData = initialData;
    }
  }
  return dbData;
}

function getDB() {
  if (!dbData) {
    initDB();
  }
  return dbData;
}

function saveDB() {
  if (dbData) {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf-8');
  }
}

module.exports = {
  getDB,
  saveDB,
  initDB
};
