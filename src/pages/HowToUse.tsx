import AppHeader from "@/components/AppHeader";
import PortalFooter from "@/components/PortalFooter";

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
            <p className="text-muted-foreground mt-3">
              The programme includes two types of activity:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li><strong>The Core Trailmaker Task</strong>, where student work contributes to a final public Trailmakers Trail across Ipswich, linked to real Blue Plaque locations</li>
              <li><strong>The Edward Caley Project</strong>, which is a more in-depth, research-focused activity designed to support learning, discussion, and proposal development</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              It is important to note that only the Core Trailmaker Task contributes to the final Trailmakers Trail. The Edward Caley Project is used to deepen understanding and does not form part of the main trail output.
            </p>
          </div>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">1. Choose Your Task</h3>
            <p className="text-muted-foreground">
              When you enter the platform, you will be given two options:
            </p>
            <div className="space-y-3 mt-2">
              <div>
                <p className="text-foreground font-semibold">Core Trailmaker Task</p>
                <p className="text-muted-foreground">
                  A structured activity where students create a character based on a Blue Plaque figure, chosen from the materials provided to your school before the session.
                </p>
                <p className="text-muted-foreground">
                  This task is research-led and does not use images within the platform. Schools will be provided with a research sheet about their chosen individual to support the activity.
                </p>
              </div>
              <div>
                <p className="text-foreground font-semibold">Edward Caley Project</p>
                <p className="text-muted-foreground">
                  An additional activity for classes who want to explore further.
                </p>
                <p className="text-muted-foreground">
                  This activity focuses on Edward Caley and his role in constructing Ipswich's Wet Dock between 1839 and 1842. It explores his responsibilities as a young engineer overseeing construction and includes a more detailed, research-led approach supported by reference images.
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Schools who have signed up for the Edward Caley Blue Plaque Proposal are encouraged to complete this activity to strengthen and enrich their final pitch.
            </p>
            <p className="text-muted-foreground">
              Each activity is supported by learning materials available on this portal, along with additional guidance provided directly by the team via email.
            </p>
            <p className="text-muted-foreground font-medium">
              Please make sure to use the accompanying resource packs provided for each activity, as these are designed to support and focus your students' research before and during the session.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2. Work Through the Character Steps</h3>
            <p className="text-muted-foreground">
              Students work in groups to develop ideas through discussion, while the teacher inputs prompts into the platform.
            </p>
            <p className="text-muted-foreground">For the Core Trailmaker Task, you will generate three images based on your research:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Face</strong> — based on a descriptive sentence created by the group</li>
              <li><strong>Object</strong> — something important to the character</li>
              <li><strong>Full Character</strong> — combining the face, object and overall appearance</li>
            </ul>
            <p className="text-muted-foreground">Each stage builds on the previous one.</p>
            <p className="text-muted-foreground">
              For the Edward Caley Project, the process is more detailed and includes five tasks, following a more in-depth, research-led approach supported by both written materials and reference images.
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
              For the Core Trailmaker Task, descriptions should be based on the research sheet rather than visual references.
            </p>
            <p className="text-muted-foreground">
              This process helps students understand how descriptive language shapes visual outcomes.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">4. Object Interaction</h3>
            <p className="text-muted-foreground">
              When creating the full character, you will choose how the object is used or held. This helps define the character's role and personality.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">5. Saving and Downloading</h3>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Important:</strong> Generated images are <strong>not</strong> automatically saved. They only exist on screen until you click <strong>Download &amp; Save</strong>. Clicking this button does two things:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-1">
              <li>Downloads the image to your device</li>
              <li>Saves a copy to the Trailmakers central storage</li>
            </ol>
            <p className="text-muted-foreground">
              If you do not click <strong>Download &amp; Save</strong>, the image will be lost when you move on or close the page. You <strong>must</strong> download your final images for them to be stored centrally.
            </p>
            <p className="text-muted-foreground">
              This means you can freely experiment and regenerate as many times as you like. Only the images you choose to download will be kept.
            </p>
            <p className="text-muted-foreground">
              Every saved image is <strong>time-stamped</strong>, so we can see exactly when each one was created. This helps us track progress and distinguish between testing and real sessions.
            </p>
            <p className="text-muted-foreground">Teachers will need to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Click Download &amp; Save</strong> on every final image you want to keep</li>
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
            <p className="text-muted-foreground">For the Core Trailmaker Task, by the end of the session you will have:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>A character face</li>
              <li>A related object</li>
              <li>A full character image</li>
            </ul>
            <p className="text-muted-foreground">
              These images will be used to help create the final Trailmakers Trail across Ipswich, where student-designed characters will be linked to real Blue Plaque locations around the town.
            </p>
            <p className="text-muted-foreground">
              The face image (head and shoulders) may be used as part of the Ipswich Trailmakers Google Trail launching in September 2026, where characters will appear in short animated introductions at each location.
            </p>
            <p className="text-muted-foreground">
              This means students are contributing to a real public-facing project, where their work helps bring local history to life through character design and storytelling.
            </p>
            <p className="text-muted-foreground">
              For the Edward Caley Project, the final outputs support deeper research and understanding. This work may be used to inform presentations, discussions, or proposal development rather than being part of the main Trailmakers Trail.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">7. Tips for Best Results</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Keep descriptions clear and specific</li>
              <li>Base ideas on research and evidence</li>
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
      <PortalFooter />
    </div>
  );
};

export default HowToUse;
