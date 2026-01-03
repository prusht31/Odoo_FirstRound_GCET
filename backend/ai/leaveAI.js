function predictLeave(leaveCount, avgAttendance, reasonLength){
  let score = 0;
  if(leaveCount < 3) score += 40;
  if(avgAttendance > 85) score += 40;
  if(reasonLength > 20) score += 20;
  return Math.min(score,100);
}

module.exports = predictLeave;
