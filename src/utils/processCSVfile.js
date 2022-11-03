const processCsvFile = function (file) {
  const arrayOfFastaEntries = splitMultiFasta(file);
  return arrayOfFastaEntries
};

function splitMultiFasta(target) {
  const fastaArray = target.split(">");
  const reads = []
  let ref = {}
  const regex = /^-*/
  const dnaSeq = /[ATCG]{18,32}/
  fastaArray.forEach((fasta, i) => {
    if (!fasta) return
    const tmpSplit = fasta.split('\n')
    const tmpFirstLine = tmpSplit[0];
    const tmpSecondLine = tmpSplit[1];
    const tmpSeq = tmpSecondLine.match(dnaSeq)[0];
    const gapsBeforeSeq = tmpSecondLine.match(regex)[0];

    const unit = {
      seqName: tmpFirstLine,
      seq: tmpSeq,
      seqLength: tmpSeq.length,
      start: gapsBeforeSeq?.length || 0,
      end: gapsBeforeSeq?.length || 0 ? tmpSeq.length : tmpSeq.length + gapsBeforeSeq?.length,
      orientation: tmpFirstLine.endsWith('reversed)') ? 'reverse' : 'forward',
    }
    if(i === 1) {
      ref = unit
    } else { reads.push(unit) }
  }
  )
  const countReverseReads = reads.filter(read => read.orientation === 'reverse').length
  // const frRvRatio = countReverseReads
  const frRvRatio = ((reads.length - countReverseReads) / countReverseReads).toFixed(3)

  const uniques = new Set(reads.flatMap( ({seq}) => seq))
  const uniquesCount = uniques.size
  const totalCount = reads.length
  const nonRedundantPerc = (100 * uniquesCount / totalCount).toFixed(2);

  return {ref, reads, frRvRatio, totalCount, nonRedundantPerc}

}

export default processCsvFile;