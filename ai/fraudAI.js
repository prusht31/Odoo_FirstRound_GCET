module.exports = function(records){
  let flags = [];
  records.forEach(r=>{
    if(r.checkIn && r.checkIn.includes("12:"))
      flags.push(r);
  });
  return flags;
};
