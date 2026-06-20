export default async function handler(req, res) {
  const apiKey = process.env.JOTFORM_API_KEY;
  const url = `https://api.jotform.com/form/242347443170149/submissions?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const members = (data.content || [])
      .filter(submission => submission.status !== 'INACTIVE')
      .map(submission => {
        const answers = submission.answers || {};
        const getAnswer = (label) => {
          const field = Object.values(answers).find(a => a.text === label);
          return field ? field.answer : '';
        };

        return {
          name: getAnswer('Business Owner Name'),
          business: getAnswer('Business Name'),
          photo: getAnswer('Headshot')
        };
      });

    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch directory submissions' });
  }
}
