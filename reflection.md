# Project Reflection

The prompt that worked best explicitly stated the persona, formatting constraints, and context, e.g., "Act as an IPL cricket commentator analyzing fan sentiment for RR vs GT. Output your response strictly as JSON with sentiment score and a witty remark." This gave predictable, well-structured outputs that integrated easily with the frontend component. 

A prompt that failed was initially too vague, simply asking "What do fans think about the RR vs GT match?". This led to rambling, unstructured text that broke our JSON parsing logic and didn't fit the UI layout. 

Next time, I would include few-shot examples directly within the system prompt to ensure even higher consistency in the output format and tone, minimizing any risk of the model hallucinating its own formatting.
