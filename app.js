// Your specific Supabase credentials
const SUPABASE_URL = 'https://jiqhmctghoogytwdsjkr.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_hEIvBg6VqU_SvvTbdlFBSQ_6hNKF9KS';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const colors = { 'A': 'red', 'B': 'blue', 'C': 'green', 'D': 'yellow', 'E': 'orange' };
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runColorSequence(text) {
    // Filter text for only A, B, C, D, or E
    const validLetters = text.toUpperCase().split('').filter(char => colors[char]);

    if (validLetters.length === 0) return;

    // Loop the entire process 5 times
    for (let i = 0; i < 5; i++) {
        for (let char of validLetters) {
            // 1. Show Color (4 seconds)
            document.body.style.backgroundColor = colors[char];
            await wait(4000);

            // 2. Black Separator (0.5 seconds)
            document.body.style.backgroundColor = 'black';
            await wait(500);
        }

        // 3. White Light at the end (3 seconds)
        document.body.style.backgroundColor = 'white';
        await wait(3000);
        
        document.body.style.backgroundColor = 'black';
        await wait(500);
    }

    // Clear the database after the 5 loops are finished
    console.log("Sequence finished. Clearing data...");
    await supabaseClient.from('messages').delete().neq('id', 0);
}

// Listen for new rows added to 'messages' table
const channel = supabaseClient
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      runColorSequence(payload.new.content);
    }
  )
  .subscribe();