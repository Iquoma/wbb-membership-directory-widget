export default async function handler(req, res) {
  const apiKey = process.env.JOTFORM_API_KEY;
  const url = `https://api.jotform.com/form/242347443170149/submissions?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const members = (data.content || [])
      .filter(submission => {
        const answers = submission.answers || {};
        const statusAnswer = Object.values(answers).find(
          a => a.name === 'status' || a.text === 'Status'
        );
        return statusAnswer ? statusAnswer.answer !== 'Inactive' : true;
      })
      .map(submission => {
        const answers = submission.answers || {};
        const getAnswer = (fieldName) => {
          const field = Object.values(answers).find(a => a.name === fieldName);
          return field ? field.answer : '';
        };

        return {
          name: getAnswer('name'),
          business: getAnswer('business'),
          photo: getAnswer('photo')
        };
      });

    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch directory submissions' });
  }
}
