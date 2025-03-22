const { exec } = require('child_process');
const fs = require('fs');

function getCommitData() {
  return new Promise((resolve, reject) => {
    exec('git log --pretty=format:%H%x09%ci%x09%s', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.split('\n').reverse());
      }
    });
  });
}

async function calculateCodeChanges() {
  const commits = await getCommitData();
  console.log('get commits:', commits, '\n');
  const results = [];

  // 使用 Promise.all 来确保异步操作执行完成
  const promises = commits.slice(1).map((commit, i) => {
    const [currentHash, date, message] = commit.split('\t');
    const previousHash = commits[i].split('\t')[0];

    return new Promise((resolve, reject) => {
      exec(`git diff --stat ${previousHash} ${currentHash} -- ':!src/generated.ts' 'src' ':!*.json'`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        // 解析 diff 输出，提取新增、删除行数
        const lines = stdout.split('\n');
        console.log('lines:', lines, '\n');

        let insertions = 0;
        let deletions = 0;

        if (lines.length > 1) {
          const lastLine = lines[lines.length - 2]; // 获取最后一行
          console.log('last line:', lastLine, '\n');
    
          // 灵活的正则表达式，匹配数字和单位
          const regex = /^\s*\d+ files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?$/;
          const match = lastLine.match(regex);
          console.log('match:', match);
          
          if (match) {
            insertions = match[1] ? parseInt(match[1]) : 0;
            deletions = match[2] ? parseInt(match[2]) : 0; 
            console.log('insertions:', insertions, ' ');
            console.log('deletions:', deletions, '\n');
          }  
        }
        
        // 在异步回调中更新 results
        results.push({
          date,
          message,
          insertions,
          deletions,
        });

        resolve(); // 确保异步操作完成
      });
    });
  });

  // 等待所有的 Promise 完成
  await Promise.all(promises);
  
  return results; // 返回最终的 results 数组
}

async function writeToFile(data) {
  fs.writeFileSync('commit_changes.txt', data.map(commit => {
    return `${commit.date}\t${commit.message}\t${commit.insertions}\t${commit.deletions}`;
  }).join('\n'));
}

calculateCodeChanges()
  .then(writeToFile)
  .catch(error => {
    console.error('Error:', error);
  });