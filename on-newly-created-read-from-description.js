/**
 * This is a template for an on-change rule. This rule defines what
 * happens when a change is applied to an issue.
 *
 * For details, read the Quick Start Guide:
 * https://www.jetbrains.com/help/youtrack/devportal/Quick-Start-Guide-Workflows-JS.html
 */

const entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'On newly reported',
  guard: (ctx) => {
    return ctx.issue.becomesReported;
  },
  action: (ctx) => {
    const issue = ctx.issue;
    const description_lines = issue.description.toString().split("\n");
    console.log(description_lines);
    
    description_lines.forEach((v) => {
      const l = v.toLocaleLowerCase().trim();
      
      if (l.startsWith("due:")) {
        let arg1 = l.substring(4).trim();
        
        if (arg1.startsWith('+')) {
          // Process diff from today.
          let offset = arg1.substring(1).trim();
          let power = 1;
          if (arg1.endsWith('d')) {
            power = 1;
            offset = offset.substring(0, offset.length - 1);
          } else if (arg1.endsWith('w')) {
            power = 7;
            offset = offset.substring(0, offset.length - 1);
          } else if (arg1.endsWith('m')) {
            power = 30;
            offset = offset.substring(0, offset.length - 1);
          }
          offset = parseInt(offset);
          let due_day_offset = offset * power;

          let duedate = Date.now();
          duedate = duedate + (due_day_offset * 24 * 60 * 60 * 1000);

          ctx.issue.fields.DueDate = duedate;
        }
      }
    });
  },
  requirements: {
    DueDate: {
      type: entities.Field.dateType,
      name: 'Due Date'
    }
  }
});