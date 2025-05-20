# ERI API Specifications

## Integrated e-filing and CPC 2.0 Project


Version History

```
Version Date Description
```
```
1.0 29 - 10 - 2021 Initial Draft
```
```
1.1 17 - 11 - 2021 Session details updated for type 2 ERI
```

## Table of Contents

- 1 INTRODUCTION
   - 1.1 Types of Intermediaries
   - 1.2 Objective of this document
   - 1.3 Scope of the Specification
- 2 OVERVIEW OF APIS
   - 2.1 API Catalog in Context..............................................................................................................................................
   - 2.2 About Authentication APIs and Session
   - 2.3 About Verification APIs
- 3 API SPECIFICATION
- 4 SIGNING API REQUEST


## 1 INTRODUCTION

One of the key visions of Integrated E-Filing CPC program is to enable 3rd parties to enhance taxpayer experience by
providing their own tax solutions in the areas of tax return preparation and submission. Such 3rd parties are called
Electronic Return Intermediaries (ERIs). Software solutions developed by these intermediaries will essentially need to
interact with the eFiling system to provide complete services. These include authentication, getting prefill data, perform

validations and submission of Income Tax Returns (ITRs).

### 1.1 Types of Intermediaries

```
The solution envisions 3 different types of intermediaries:
```
```
a. ERI-Type 1: Qualified Tax Professionals who act on behalf of the taxpayers and provide tax return preparation
services. But they do not provide software solutions on their own – instead use the solutions provided by the
department or Type-3 intermediaries.
b. ERI-Type 2: Tax Software Providers who act on behalf of the taxpayer and provide tax return reparation
services including the necessary software for return preparation.
c. ERI Type 3: Tax Software Providers who provide tax return preparation software to either taxpayers or Type- 1
intermediaries. They are pure software providers and do not themselves act on behalf of the taxpayers.
```
### 1.2 Objective of this document

The objective of this document is to define and describe specifications of the APIs that shall be used by the
intermediaries to interact with the eFiling system.

### 1.3 Scope of the Specification

The scope of this document is limited to the Apis required for tax return preparation and submission to the e-filing
system.

- Specification for other services such as viewing of return status, adding of bank accounts, refund status et cetera
    maybe added in the future.
- One of the APIs that shall be described later in this document include the fetching of the prefill data. The schema
    for the prefill payload returned is not included in this API specification. Intermediaries are instructed to study
    the prefill schema document published on eFiling Portal for this purpose. TODO
- The APIs for validation and Submit shall carry a payload that includes the ITR Form data. The schema for the
    form payload for each of the 7 ITRs is not included in this document. Intermediaries are requested to refer to
    the ITR Form schema documentation published on eFiling Portal for this purpose
- The form data submitted must be compliant to the ITR rules specified by the department. The intermediaries are
    expected to study the validation rules and implement necessary validations/computation within their software
    in a manner that is conformant to the published rules. The validation rules for each form are available on the
    eFiling Portal


## 2 OVERVIEW OF APIS

The following sections provide an overview of the API specification in the form of functional catalog.

### 2.1 API Catalog in Context..............................................................................................................................................

The API Catalog is best understood when viewed from the perspective the larger functional purpose they serve. Broadly
defined there are two three distinct phases or flows in tax return preparation.

1. **Initiation Phase:** In this phase the return preparation is initiated by fetching the information required to prefill
    the various sections of the return
2. **Return Preparation Phase:** In this phase, the user interacts with the software provided by the intermediary to
    complete the return preparation. It may be noted that there will be no interaction with the efiling system during
    this phase. All interactions including saving of the return etc. shall be performed within the domain of the
    intermediary’s software.
3. **Submission Phase:** In this phase, the return is submitted to the filing system. The submission flow follows three
    steps
       a. Validation of the return
       b. Saving of the Validated Return
       c. Selection of eVerification mode and completion of Verification
       d. Submission of the Verified Return

The following figure presents a catalogue of APIs that shall be consumed by the intermediary in each of these phases.

**Pre-Initiation Phase:**

**Post-Submission Phase:**

- As illustrated in the figure above, each interaction phase will commence with an authentication call to _begin a_
    _session_ and conclude with the logout call to _end the session._ See more on the concept of a session in subsequent
    sections.
- The interaction in the Initiation phase will only include a call to fetch the prefill data available at the time of API
    call. It may be noted that prefill data of the taxpayer may change based on information availability. It is


```
therefore suggested that software providers include a menu or a feature to refresh prefill schema at user
request.
```
- The interaction in the submission phase will include 3 key steps
    o Validation: Validation of the ITR data prepared now. It is expected that that the software design should
       include local validation of the return before transmission to the efiling system. The API is meant for final
       validation just before submission and SHOULD NOT BE construed as a substitute for validations that
       must be implemented with the utility software itself.
    o Verification APIs: This includes one or more APIs which shall be invoked for eVerifying the return. The
       applicable APIs will vary based on the verification mode selected. For example, if verification mode is
       through Aadhaar OTP, there will be two calls to eFiling system – first to generate the OTP and next to
       validate the OTP. On the other hand, if the verification mode is ITR-V or DSC or Verify Later, then there
       shall be only one call.
    o Submission: The submit call completes the ITR filing process with the chosen verification mode.


### 2.2 About Authentication APIs and Session

As noted earlier, every interaction with the eFiling system begins with establishing a session through a login API. That
said, there are differences between the two types of ERIs which is compared and contrasted in the below table.

```
Aspect ERI Type 2 ERI Type 3
```
```
Access Method Via API GW Via Web API
```
```
Session Created for Type 2 ERI Taxpayer or ERI Type- 1
```
```
Credentials Supplied ClientID, Client Secret, ERIUserID and
ERIPassword
```
```
Taxpayer or ERI-1 Credentials
(PAN/Aadhaar, Password, OTP etc.)
```
```
Description Creates a session for the ERI- 2
themselves. Subsequent calls
operate in the context of the ERI-2’s
session. Each call will carry the
context of the PAN which they want
to operate on and shall be validated
for appropriate access.
```
```
Creates a session for the Taxpayer or
ERI-Type 1. Subsequent calls operate
in the context of the session
established. Each call will carry the
PAN which shall be matched with the
logged in PAN in case of Taxpayer. In
case of ERI-Type-1, the system shall
validate appropriate access.
```
```
Number of Sessions Allowed Single Single
```
```
Session Validity (Period of Inactivity) 24 hours or until logout 45 Minutes
```
```
Session Identification AUTH token (sent as a cookie) AUTH token (sent as a cookie)
```
```
Login Methods Available Password Only Password, Mobile OTP, Bank OTP
(Taxpayer Only), Aadhaar OTP
```
### 2.3 About Verification APIs

As noted earlier, the submission flow includes a set of Verification APIs to eVerify the return. The following table
describes each of the verification modes and the applicable model for utilizing it.

```
Verification Mode Notes
```
```
eVerify Later • Indicates the taxpayer shall verify the return later by
logging into the portal
```
- The software shall make only 1 API call indicating the
    same

**ITR-V** (^) • Indicates the taxpayer shall verify the return by
downloading and sending the physical ITR-V to CPC
center. The download of ITR-V will be available on the
Portal.

- The software shall make only 1 API call indicating the
    same.

**Aadhaar OTP, Mobile OTP, Bank OTP and Demat OTP** (^) • Indicates the taxpayer shall verify the return by the
chosen method.


- Available for ERI-Type-3 only as it requires the
    presence of the taxpayer.
- Not Available for ERI-Type- 2
- The software shall make two API calls in a sequence.
    The first call shall request the efiling system to
    generate the OTP and send it to the mobile number
    associated with the chosen channel.
- The second call shall validate the OTP and mark the
    return as verified.

```
Digital Signature Certificate • Indicates that the subsequent submit payload shall
carry Form payload digitally signed by the taxpayer.
```
- This method shall be available to both Type-2 and
    Type-3 ERIs
- The software shall make 1 API call indicating the
    chosen method as DSC.
- The subsequent submit call should carry the taxpayer
    signed form payload. It is the responsibility of the
    software provider to submit a digitally signed payload.
- The signature should be in PKCS#7 format
- The signature should be generated using a valid X.
    certificate belonging to the taxpayer and should be
    preregistered against the taxpayer PAN in the eFiling
    system

## 3 API SPECIFICATION

The specification for each of the API are included in separate document. The objective is to upload them into an API
portal in swagger format. The following table provides references to each API.

```
API Name Specification Document
Authentication API_Login_0.1.docx
Get Prefill API_Prefill_0. 2 .docx
Validation API_SubmitFlow_0.1.docx
Verification API_Everify_Return_0.1.docx
Submit API_SubmitFlow_0.1.docx
Add Client API_AddClient_0.1.docx
Get Acknowledgement API_AcknowledgementFlow_0.1.docx
```
## 4 SIGNING API REQUEST

All the API will have below attribute as part of the request:

**Data** – Base64 encoded string from request json given in each API specification document

**Signature** – Singed value from data field using ERI’s DSC private key. ERI will share their DSC public key with ITD to
validate the signature.


