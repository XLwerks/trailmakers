import AppHeader from "@/components/AppHeader";

const HowToUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="How To Use" showHomeButton />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">How to Use Trailmakers</h2>
            <p className="text-muted-foreground">
              Trailmakers allows you to create student-designed characters using a simple, guided process.
            </p>
          </div>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">1. Choose Your Task</h3>
            <p className="text-muted-foreground">
              When you enter the platform, you will be given two options:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Compulsory Task</strong> — a structured activity where students create a character based on a Blue Plaque figure, chosen from the materials provided to your school before the session</li>
              <li><strong>Edward Caley Project</strong> — an additional activity for classes who want to explore further</li>
            </ul>
            <p className="text-muted-foreground">
              The Edward Caley project focuses on Edward Caley and his role in constructing Ipswich's Wet Dock. This activity is designed for schools that wish to deepen their understanding of his work through more detailed research.
            </p>
            <p className="text-muted-foreground">
              Schools who have signed up for the Edward Caley: Blue Plaque Proposal are encouraged to complete this activity to strengthen and enrich their final pitch.
            </p>
            <p className="text-muted-foreground">
              It may also be helpful to include references to supporting learning materials for each activity. For example, the Edward Caley activity will include a resource pack, with the compulsory task on a chosen individual supported by a starter image and a one-page research sheet.
            </p>
            <p className="text-muted-foreground font-medium">
              Please make sure to use the accompanying resource packs provided for each activity — these are designed to support and focus your students' research before and during the session.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2. Work Through the Character Steps</h3>
            <p className="text-muted-foreground">
              Students work in groups to develop ideas through discussion, while the teacher inputs prompts into the platform.
            </p>
            <p className="text-muted-foreground">For the Compulsory Task, you will generate three images:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Face</strong> — based on a descriptive sentence created by the group</li>
              <li><strong>Object</strong> — something important to the character</li>
              <li><strong>Full Character</strong> — combining the face, object and overall appearance</li>
            </ul>
            <p className="text-muted-foreground">Each stage builds on the previous one.</p>
            <p className="text-muted-foreground">
              For the Edward Caley Project, the process is more detailed and includes five tasks, following a more in-depth, research-led approach.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">3. Generating Images</h3>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-1">
              <li>Discuss and agree a clear descriptive sentence as a group</li>
              <li>The teacher enters this into the platform</li>
              <li>Generate the image</li>
              <li>If needed, refine the sentence and regenerate</li>
            </ol>
            <p className="text-muted-foreground">
              This process helps students understand how descriptive language shapes visual outcomes.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">4. Object Interaction</h3>
            <p className="text-muted-foreground">
              When creating the full character, you will choose how the object is used.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">5. Saving and Downloading</h3>
            <p className="text-muted-foreground">
              Images are only saved to cloud storage when you click <strong>Download &amp; Save</strong>. Until then, generated images exist only on screen and are not stored. This means you can freely experiment and regenerate without filling up storage.
            </p>
            <p className="text-muted-foreground">
              Every saved image is <strong>time-stamped</strong>, so we can see exactly when each one was created. This helps us track progress and distinguish between testing and real sessions.
            </p>
            <p className="text-muted-foreground">Teachers will need to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Download and save only the images you want to keep</li>
              <li>Save them to their school system if required</li>
              <li>Use them later for presentations or project work</li>
            </ul>
          </section>

          <section className="bg-accent/30 border border-accent rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">🧪 Testing Tip</p>
            <p className="text-sm text-muted-foreground">
              If you are exploring the platform before your real session, please enter <strong>"TEST"</strong> as your Class Name. This lets us clearly identify testing sessions and separate them from actual student work. We will clear out test data from storage before schools begin their real sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">6. Final Output</h3>
            <p className="text-muted-foreground">By the end of the session, you will have:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>A character face</li>
              <li>A related object</li>
              <li>A full character image</li>
            </ul>
            <p className="text-muted-foreground">
              The head and shoulders image may be used as part of the Ipswich Trailmakers Google Trail launching in September 2026, where characters will appear in short animated introductions at each location.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">7. Tips for Best Results</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Keep descriptions clear and specific</li>
              <li>Base ideas on research and visual evidence</li>
              <li>Do not spend too long refining one image</li>
              <li>Focus on the process and discussion</li>
            </ul>
          </section>

          <section className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground">Important</p>
            <p className="text-sm text-muted-foreground mt-1">
              Students do not use the AI platform directly. The teacher inputs all prompts based on group discussion.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
