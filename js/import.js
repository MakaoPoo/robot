(function() {
  for(const partsType in ALL_PARTS_NUMS){
    const partsNums = ALL_PARTS_NUMS[partsType];

    for(let i = 0; i < partsNums; i++) {
      const id = ('000' + i).slice(-PARTS_ID_LENGTH);
      const script = '<script src="js/parts/'+ partsType +'/'+ id +'.js"></script>';
      document.write(script);
    }
  }
  
  document.write('<script src="js/stage/stage.js"></script>');
})();
