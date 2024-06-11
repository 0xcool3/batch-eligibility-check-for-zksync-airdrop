import React from "react";
// import { Link } from "@nextui-org/link";
// import { Snippet } from "@nextui-org/snippet";
// import { Code } from "@nextui-org/code";
// import { button as buttonStyles } from "@nextui-org/theme";
import { Button } from "@nextui-org/button";
import { Spacer } from "@nextui-org/spacer";
import { Textarea } from "@nextui-org/input";
// import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import SearchResult from "@/components/SearchResult";
import { checkEligible } from "@/lib/checkEligible";
import { checkDBExisted } from "@/lib/checkDBExisted";
// import { downloadData } from "@/lib/downloadData";
import { startDownload } from "@/lib/downloadData";
import { Progress } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import faqs from "@/components/faq";

export default function IndexPage() {
  const [btnBusy, setBtnBusy] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [progress, updateProgress] = React.useState({
    loaded: 0,
    total: 1,
    title: "Downloading eligibility_list.csv...",
  });

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Batch eligibility check for &nbsp;</h1>
          <h1 className={title({ color: "violet" })}> zkSync airdrop.&nbsp;</h1>
          <br />
          <h1 className={title()}></h1>
          <h4 className={subtitle({ class: "mt-4" })}>
            Simple, Privacy, Open Source
          </h4>
        </div>

        <div className="w-full max-w-2xl gap-2">
          <Textarea
            value={value}
            onValueChange={setValue}
            maxRows={20}
            variant="faded"
            label=""
            placeholder="Enter a list of addresses, one address per line"
            description=""
            className="max-w-2xl"
          />
          <Spacer y={4} />
          <Button
            fullWidth
            isLoading={btnBusy}
            color="primary"
            onClick={async () => {
              try {
                setBtnBusy(true);
                console.log("setBtn busy");
                const isExisted = await checkDBExisted();
                if (!isExisted) {
                  // await downloadData();
                  console.log("before startDownload");
                  await startDownload(
                    "/eligibility_list.csv",
                    (loaded: number, total: number, title: "") => {
                      // console.log({ loaded, total });
                      updateProgress({ loaded, total, title });
                    }
                  );
                }

                const results: any = await checkEligible(value.split("\n"));
                setUsers(results);
                setBtnBusy(false);
              } catch (e) {
                console.error(e);
                setBtnBusy(false);
              }
            }}
          >
            Query
          </Button>
          <Spacer y={4} />

          {progress.loaded > 0 && progress.loaded < progress.total && (
            <Progress
              aria-label="Downloading..."
              size="md"
              label={progress.title}
              value={Math.ceil((progress.loaded / progress.total) * 100)}
              color={
                Math.ceil((progress.loaded / progress.total) * 100) == 100
                  ? "success"
                  : "primary"
              }
              showValueLabel={true}
              className="max-w-md"
            />
          )}

          <Spacer y={16} />
          {users.length >= 1 && <SearchResult users={users} />}

          <Spacer y={16} />
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
            <h2 className="w-full max-w-3xl bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text px-2 text-center text-3xl font-bold leading-7 tracking-tight text-transparent md:text-5xl">
              <span className="inline-block md:hidden"> FAQs</span>
              <span className="hidden md:inline-block">
                Frequently asked questions
              </span>
            </h2>
            <Accordion
              fullWidth
              keepContentMounted
              itemClasses={{
                base: "px-0 md:px-2 md:px-6",
                title: "font-medium",
                trigger: "py-6 flex-row-reverse",
                content: "pt-0 pb-6 text-base text-default-500",
                indicator: "rotate-0 data-[open=true]:-rotate-45",
              }}
              items={faqs}
              selectionMode="multiple"
            >
              {faqs.map((item, i) => (
                <AccordionItem
                  key={i}
                  indicator={
                    <Icon
                      className="text-secondary"
                      icon="lucide:plus"
                      width={24}
                    />
                  }
                  title={item.title}
                >
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Documentation
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div> */}

        {/* <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Get started by editing{" "}
              <Code color="primary">pages/index.tsx</Code>
            </span>
          </Snippet>
        </div> */}
      </section>
    </DefaultLayout>
  );
}
