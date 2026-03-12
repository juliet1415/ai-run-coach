const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./run.db");

// 创建跑步数据表
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      distance REAL,
      duration REAL
    )
  `);
});

// 添加跑步记录
app.post("/api/run", (req, res) => {
  const { date, distance, duration } = req.body;

  db.run(
    `INSERT INTO runs(date,distance,duration) VALUES(?,?,?)`,
    [date, distance, duration],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// 获取所有跑步记录
app.get("/api/runs", (req, res) => {
  db.all(`SELECT * FROM runs`, [], (err, rows) => {
    res.json(rows);
  });
});

// AI训练计划（简单示例）
app.get("/api/plan", (req, res) => {
  const plan = [
    { day: "周一", training: "休息" },
    { day: "周二", training: "8km节奏跑" },
    { day: "周三", training: "力量训练" },
    { day: "周四", training: "10km轻松跑" },
    { day: "周五", training: "休息" },
    { day: "周六", training: "间歇跑" },
    { day: "周日", training: "15km长距离" }
  ];

  res.json(plan);
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("AI Run Coach running on port 3000");
});
