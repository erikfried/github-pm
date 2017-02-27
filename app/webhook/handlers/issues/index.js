const Github = require('github-api');
const issues = new Github({
    token: process.env.GITHUB_TOKEN
}, process.env.GITHUB_API_BASE).getIssues(process.env.REPO_OWNER, process.env.REPO_NAME);

const randomColors = ["ffaf30", "945ae3", "598b00", "ff98e3", "017829", "d2291e", "36b5ff", "c19f00", "2a5194",
    "bd7200", "c9adff", "656600", "a21635", "70daac", "ff8c91", "00a06a", "ff906a", "a5d473", "77471b", "ddc487"];
const getRandomColor = () => randomColors[Math.floor(Math.random() * randomColors.length)];


const ensureLabel = async (title) => {
    const labels = await issues.listLabels();
    console.log('Fetched label', labels.data);
    if  (!labels.data.find(({name}) => name === title)) {
        var newVar = {
            "name": title,
            "color": getRandomColor()
        };
        console.log('new label', newVar);
        try {
            const newLabel = await issues.createLabel(newVar);
            console.log('Created label', newLabel.status, newLabel.data);
        } catch (e) {
            console.log('ERROR creating label', e);
            throw e;
        }

    }
};

const addLabelToIssue = async (issueNumber, label) => {
    const { data } = await issues.getIssue(issueNumber);
    console.log('Fetched issue', data);
    const issue = {
        title: data.title,
        body: data.body,
        state: data.state,
        assignees: data.assignees.map(({login}) => login),
        milestone: data.milestone.number, //Format for update and reponse differs.
        labels: data.labels.concat(label)
    };
    try {
        await issues.editIssue(issueNumber, issue);
        console.log('Updated issue');
    } catch (e) {
        console.log('ERROR UPDATING', e.response && e.response.status, e.response && e.response.data);
        console.log('Data:', issue);
        throw e;
    }
}

const getLabel = milestone => (milestone && milestone.title ? milestone.title.substring(0, 20): null);

module.exports = async (ctx, next) => {
    const data = ctx.request.body;
    const {
        issue: {
            number: issueNumber,
            milestone = {}
        },
        labels = [] } = data;

    const label = getLabel(milestone);
    if (label) {

        if  (labels.find(({name}) => name === label)) {
            console.log('OK, issue already contains label for milestone');
        } else {
            ensureLabel(label);
            addLabelToIssue(issueNumber, label)
        }
    }

    await next();
}
