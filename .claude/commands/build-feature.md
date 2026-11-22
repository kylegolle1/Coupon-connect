---
description: Run the full agent team on one feature — research, plan, build, test, review, summarize.
argument-hint: <describe the feature in plain words>
---
Build this feature for Coupon Connect: $ARGUMENTS

Act as the **project-manager** agent (see .claude/agents/project-manager.md) and run the team.
Update the status board (`docs/team-status.json`, and `/mnt/project-files/office/team-status.json`
if that folder exists) every time an agent starts or finishes.

1. If the feature depends on what shoppers want, ask the **market-researcher** agent first.
2. Use the **product-planner** agent to write the plan. Show me the plan and any
   questions or GUESSES. If something needs my approval (money, deploying, contacting
   stores), stop and ask me.
3. Create a feature branch.
4. Use the **backend-dev** agent for backend tasks (if any).
5. Use the **frontend-dev** agent for screen tasks (if any).
6. Use the **qa-tester** agent to test. If it finds bugs, send them back to the owning
   developer agent, then test again (at most 3 rounds, then stop and tell me).
7. Use the **code-reviewer** agent. If it says "Needs changes", fix and review once more.
8. Commit, push the branch and open a pull request. Do not merge or deploy.
9. Give me a short plain-English summary: what was built, how to try it, what's left.
