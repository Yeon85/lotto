
import React, { useMemo, useState } from 'react'

// 동행복권 색상 규칙(관례): 1-10 노랑, 11-20 파랑, 21-30 빨강, 31-40 회색, 41-45 초록
function colorClass(n){
  if(n <= 10) return 'yellow'
  if(n <= 20) return 'blue'
  if(n <= 30) return 'red'
  if(n <= 40) return 'gray'
  return 'green'
}

// 6/45 한 줄 생성 (오름차순, 중복X)
function pickLine(){
  const nums = new Set()
  while(nums.size < 6){
    nums.add(1 + Math.floor(Math.random() * 45))
  }
  return Array.from(nums).sort((a,b) => a - b)
}

// N줄 생성
function pickMany(n=5){
  return Array.from({length:n}, () => pickLine())
}

function Ball({n}){
  return (
    <div className={'ball ' + colorClass(n)}>
      <span>{n}</span>
    </div>
  )
}

export default function App(){
  const [lines, setLines] = useState(() => pickMany(5))

  const copyText = useMemo(() => {
    return lines.map((line,i) => `L${i+1}: ` + line.join(', ')).join('\n')
  }, [lines])

  const regenAll = () => setLines(pickMany(5))
  const regenOne = (idx) => {
    setLines(prev => prev.map((line, i) => i === idx ? pickLine() : line))
  }

  const handleCopy = async () => {
    try{
      await navigator.clipboard.writeText(copyText)
      alert('복사 완료! 카톡에 바로 붙여넣기 하세요.')
    }catch(e){
      alert('복사 실패 😅 — 브라우저 권한을 확인해주세요.')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">🎯 로또 6/45 자동 생성기</h1>
          <button className="btn" onClick={regenAll}>전체 다시 생성</button>
        </div>

        <div className="grid">
          {lines.map((line, idx) => (
            <div className="row" key={idx}>
              <div className="badge">L{idx+1}</div>
              {line.map(n => <Ball key={n+'-'+idx} n={n} />)}
              <div className="tools">
                <button className="btn" onClick={() => regenOne(idx)}>이 줄만 다시</button>
              </div>
            </div>
          ))}
        </div>

        <div className="footer">
          <div className="copy">한 줄: 6개 / 총 {lines.length}줄 · 동행복권 스타일 색상</div>
          <div style={{display:'flex', gap:8}}>
            <button className="btn" onClick={handleCopy}>결과 복사</button>
            <button className="btn" onClick={() => setLines(prev => [...prev, pickLine()])}>줄 추가</button>
          </div>
        </div>

        <div className="small" style={{marginTop:8}}>
          ⚠️ 책임 있는 이용을 권장합니다. 이 도구는 난수 발생기일 뿐, 당첨을 보장하지 않습니다.
        </div>
      </div>
    </div>
  )
}
