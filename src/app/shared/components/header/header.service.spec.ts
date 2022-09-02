import { TestBed } from "@angular/core/testing";

import { HeaderService } from "./header.service";

describe("HeaderService", () => {
  let service: HeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should navigate to route on goBackTo stack when goBack function is called", () => {
    service["goBackTo"] = ["/test"];
    spyOn(service["router"], "navigate").and.callFake(() =>
      Promise.resolve(true)
    );
    service.goBack();

    expect(service["goBackTo"].length).toBe(0);
  });
});
